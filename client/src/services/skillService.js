// src/services/skillService.js
import api from './api';

const skillService = {
  getAll: (config) => api.get('/skills', config),
  get: (id) => api.get(`/skills/${id}`),
  create: (data, config) => api.post('/skills', data, config),       // ← Added config
  update: (id, data, config) => api.put(`/skills/${id}`, data, config), // ← Added config
  delete: (id) => api.delete(`/skills/${id}`),
};

export { skillService };