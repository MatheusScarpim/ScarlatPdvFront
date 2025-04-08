import api from '@/shared/http/axios';

const APICore = import.meta.env.VITE_APP_API_PAG;

const CreatePixPayment = (data = {}, config = {}) => api.post(`${APICore}/payments/pix`, data, config);
const GetPaymentStatus = (paymentId, config = {}) => api.get(`${APICore}/payments/status/${paymentId}`, config);
const GetDashboardData = (config = {}) => api.get(`${APICore}/payments/vendas/dashboard`, config);

const PagamentoRepository = {
    CreatePixPayment,
    GetPaymentStatus,
    GetDashboardData
};

export default PagamentoRepository; 