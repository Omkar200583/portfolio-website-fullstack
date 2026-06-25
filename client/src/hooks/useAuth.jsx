// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("accessToken");

      // No token = not logged in
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Restore user from cache immediately (prevents redirect flash)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }

      // Verify with backend
      try {
        const res = await authService.getMe();
        const userData = res.data?.data || res.data?.user || res.data;
        
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.log("[Auth] /auth/me failed, trying refresh...");
        
        // Try refresh token
        const savedRefreshToken = localStorage.getItem("refreshToken");
        
        if (savedRefreshToken) {
          try {
            const refreshRes = await api.post("/auth/refresh", { 
              refreshToken: savedRefreshToken 
            });
            
            console.log("[Auth] Refresh successful!");
            
            const newAccessToken = refreshRes.data?.data?.accessToken;
            const newRefreshToken = refreshRes.data?.data?.refreshToken;
            
            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
            }
            
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
            
            // Get fresh user data with new token
            try {
              const meRes = await authService.getMe();
              const freshUserData = meRes.data?.data || meRes.data?.user || meRes.data;
              if (freshUserData) {
                setUser(freshUserData);
                localStorage.setItem("user", JSON.stringify(freshUserData));
              }
            } catch {
              // Keep cached user, token is valid
              console.log("[Auth] /auth/me still failed after refresh, keeping cached user");
            }
          } catch (refreshErr) {
            console.log("[Auth] Token refresh failed:", refreshErr?.response?.data || refreshErr?.message);
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } else {
          // No refresh token - keep cached user (will fail on next API call)
          console.log("[Auth] No refresh token, keeping cached user");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {}
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      const userData = res.data?.data || res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};