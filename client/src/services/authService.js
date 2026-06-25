// src/services/authService.js
import api from "./api.js";

export const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    return res.data.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // continue
    }
    localStorage.clear();
  },

  getMe: () => api.get("/auth/me"),

  updateProfile: (formData) =>
    api.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  changePassword: (data) => api.put("/auth/change-password", data),

  getCurrentUser: () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("accessToken"),

  isAdmin: () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u)?.role === "admin" : false;
  },
};