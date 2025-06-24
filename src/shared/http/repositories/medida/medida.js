import axios from 'axios';

const resourceName = 'medida';
const APICore = "http://localhost:8082/api/v1";

const GetAll = (config = {}) => axios.get(`${APICore}/${resourceName}/`, config);
const Create = (data = {}, config = {}) => axios.post(`${APICore}/${resourceName}/`, data, config);
const Update = (id, data = {}, config = {}) => axios.put(`${APICore}/${resourceName}/${id}`, data, config);
const Delete = (id, config = {}) => axios.delete(`${APICore}/${resourceName}/${id}`, config);

const MedidaRepository = {
  GetAll,
  Create,
  Update,
  Delete
};

export default MedidaRepository;