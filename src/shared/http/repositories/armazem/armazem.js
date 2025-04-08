import api from '@/shared/http/axios';

const resourceName = 'armazem';

const GetAll = (config = {}) => api.get(`/${resourceName}/`, config);
const Create = (data = {}, config = {}) => api.post(`/${resourceName}/`, data, config);
const Update = (id, data = {}, config = {}) => api.put(`/${resourceName}/${id}`, data, config);
const Delete = (id, config = {}) => api.delete(`/${resourceName}/${id}`, config);

const ArmazemRepository = {
  GetAll,
  Create,
  Update,
  Delete,
};

export default ArmazemRepository;