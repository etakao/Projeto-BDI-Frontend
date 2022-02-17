import api from './api';

const moradorApi = {
  create: (data) => api.post('morador', data),
  read: (id) => api.get(`morador/index/${id}`),
  readAll: () => api.get('morador/index'),
  update: (data) => api.put('morador/update', data),
  delete: (id) => api.delete(`morador/delete/${id}`)
};

export default moradorApi;