import api from "./api";

export const certificateService = {
  getAll: (params = {}) => api.get("/certificates", { params }),
  getOne: (id) => api.get(`/certificates/${id}`),
  create: (formData) =>
    api.post("/certificates", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    api.put(`/certificates/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`/certificates/${id}`),
};

export const experienceService = {
  getAll: () => api.get("/experience"),
  getOne: (id) => api.get(`/experience/${id}`),
  create: (formData) =>
    api.post("/experience", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    api.put(`/experience/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const contactService = {
  submit: (data) => api.post("/contact", data),
  getAll: (params = {}) => api.get("/contact", { params }),
  getOne: (id) => api.get(`/contact/${id}`),
  reply: (id, replyMessage) => api.post(`/contact/${id}/reply`, { replyMessage }),
  updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const analyticsService = {
  track: (event, page, metadata = {}) => api.post("/analytics/track", { event, page, metadata }),
  getDashboard: () => api.get("/analytics/dashboard"),
  getAll: (params = {}) => api.get("/analytics", { params }),
};

export const userService = {
  getAll: (params = {}) => api.get("/users", { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetUsage: (id) => api.post(`/users/${id}/reset-usage`),
};