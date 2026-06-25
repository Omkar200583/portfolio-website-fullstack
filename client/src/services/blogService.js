// src/services/blogService.js
import api from "./api";

const blogService = {
  getAll: (params) => api.get("/blog", { params }),
  getById: (id) => api.get(`/blog/${id}`),
  create: (data, config) => api.post("/blog", data, config),
  update: (id, data, config) => api.put(`/blog/${id}`, data, config),
  delete: (id) => api.delete(`/blog/${id}`),
};

export default blogService;