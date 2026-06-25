// import api from './api';

// const experienceService = {
//   getAll: () => api.get('/experience'),
//   create: (data) => api.post('/experience', data),
//   update: (id, data) => api.put(`/experience/${id}`, data),
//   delete: (id) => api.delete(`/experience/${id}`),
// };

// export default experienceService;


import api from "./api";

const experienceService = {
  getAll: (params) => api.get("/experience", { params }),
  getById: (id) => api.get(`/experience/${id}`),
  create: (data) => api.post("/experience", data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export default experienceService;