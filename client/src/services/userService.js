import api from './api';

const userService = {
  getAll: (search = '') => api.get(`/users?search=${search}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default userService;