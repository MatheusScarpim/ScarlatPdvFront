// filepath: /c:/Users/mathe/OneDrive/DD/GitHub/ScarlatCoreFront/src/shared/http/repositories/app/app.js
import api from '@/shared/http/axios';

const resourceName = 'medida';

const GetAll = (config = {}) => api.get(`/${resourceName}/`, config);
const Create = (data = {}, config = {}) => api.post(`/${resourceName}/`, data, config);
const Update = (id, data = {}, config = {}) => api.put(`/${resourceName}/${id}`, data, config);
const Delete = (id, config = {}) => api.delete(`/${resourceName}/${id}`, config);

const FornecedorRepository = {
  GetAll,
  Create,
  Update,
  Delete
};

export default FornecedorRepository;