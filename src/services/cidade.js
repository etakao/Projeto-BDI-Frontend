import api from './api';

const cidadeApi = {
  create: (data) => api.post('cidade', data),
  read: (id) => api.get(`cidade/index/${id}`),
  readAll: () => api.get('cidade/index'),
  update: (data) => api.put('cidade/update', data),
  delete: (id) => api.delete(`cidade/delete/${id}`)
};

export default cidadeApi;