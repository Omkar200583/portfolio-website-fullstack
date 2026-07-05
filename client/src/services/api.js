import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://portfolio-backend-vh57.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor - add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - auto refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Login / refresh / register requests वर retry करू नको
    const noRetryUrls = ["/auth/login", "/auth/refresh", "/auth/register"];

    if (noRetryUrls.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // 401 आला आणि आधी retry केलेला नसेल तर refresh token वापर
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const savedRefreshToken = localStorage.getItem("refreshToken");
      if (!savedRefreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: savedRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;
        const newRefreshToken = refreshRes.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
        }

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh fail झाला तर clear auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;