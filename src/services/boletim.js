import api from './api';

const boletimApi = {
  create: (data) => api.post('boletim', data),
  read: (id) => api.get(`boletim/index/${id}`),
  readByDate:(date) => api.get(`boletim/index/date/${date}`),
  readByIbge:(ibge)=> api.get(`boletim/index/:codigo_ibge/${ibge}`),
  update: (data) => api.put('boletim/update', data),
  delete: (id) => api.delete(`boletim/delete/${id}`)
};

export default boletimApi;