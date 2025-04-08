import axios from 'axios';
import { keycloak } from '@/auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});

api.interceptors.request.use(
    async (config) => {
        if (keycloak.token) {
            try {
                await keycloak.updateToken(30);
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            } catch (error) {
                console.error('Erro ao atualizar o token:', error);
                keycloak.login();
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;