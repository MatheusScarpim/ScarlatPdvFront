import api from '@/shared/http/axios';

const resourceName = 'categoria';

const GetAll = (config = {}) => api.get(`/${resourceName}/`, config);
const Create = (data = {}, config = {}) => api.post(`/${resourceName}/`, data, config);
const Update = (id, data = {}, config = {}) => api.put(`/${resourceName}/${id}`, data, config);
const Delete = (id, config = {}) => api.delete(`/${resourceName}/${id}`, config);

const CategoriaRepository = {
  GetAll,
  Create,
  Update,
  Delete
};

export default CategoriaRepository;