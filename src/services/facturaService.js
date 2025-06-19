import api from '../config/axios';

export const getAllFacturas = async () => {
    const response = await api.get('/facturas');
    return response.data;
}; 