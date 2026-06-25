// import api from './api';

// const certificateService = {
//   getAll: () => api.get('/certificates'),
//   create: (data) => api.post('/certificates', data),
//   update: (id, data) => api.put(`/certificates/${id}`, data),
//   delete: (id) => api.delete(`/certificates/${id}`),
// };

// // ✅ Named export
// export { certificateService };



import api from "./api";

export const certificateService = {
  getAll: (params) => api.get("/certificates", { params }),
  getById: (id) => api.get(`/certificates/${id}`),
  create: (data) => api.post("/certificates", data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

export default certificateService;