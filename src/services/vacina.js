import api from './api';

const vacinaApi = {
  create: (data) => api.post('vacina', data),
  read: (id) => api.get(`vacina/index/${id}`),
  readAll: () => api.get('vacina/index'),
  update: (data) => api.put('vacina/update', data),
  delete: (id) => api.delete(`vacina/delete/${id}`)
};

export default vacinaApi;