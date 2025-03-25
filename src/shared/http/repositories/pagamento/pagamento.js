import axios from 'axios';

const APICore = "http://localhost:4000";

const CreatePixPayment = (data = {}, config = {}) => axios.post(`${APICore}/payments/pix`, data, config);
const GetPaymentStatus = (paymentId, config = {}) => axios.get(`${APICore}/payments/status/${paymentId}`, config);

const PagamentoRepository = {
    CreatePixPayment,
    GetPaymentStatus
};

export default PagamentoRepository; 