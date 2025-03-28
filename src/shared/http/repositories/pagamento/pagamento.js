import axios from 'axios';

const APICore = "http://localhost:4000";

const CreatePixPayment = (data = {}, config = {}) => axios.post(`${APICore}/payments/pix`, data, config);
const GetPaymentStatus = (paymentId, config = {}) => axios.get(`${APICore}/payments/status/${paymentId}`, config);
const GetDashboardData = (config = {}) => axios.get(`${APICore}/payments/vendas/dashboard`, config);
const ProcessCardPayment = (data = {}, config = {}) => axios.post(`${APICore}/payments/point`, data, config);

const PagamentoRepository = {
    CreatePixPayment,
    GetPaymentStatus,
    GetDashboardData,
    ProcessCardPayment
};

export default PagamentoRepository; 