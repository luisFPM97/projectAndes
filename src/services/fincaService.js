import api from '../config/axios';

export const getAllFincas = async () => {
    const response = await api.get('/fincas');
    return response.data;
};

export const getFincaById = async (id) => {
    const response = await api.get(`/fincas/${id}`);
    return response.data;
};

export const createFinca = async (data) => {
    const response = await api.post('/fincas', data);
    return response.data;
};

export const updateFinca = async (id, data) => {
    const response = await api.put(`/fincas/${id}`, data);
    return response.data;
};

export const deleteFinca = async (id) => {
    const response = await api.delete(`/fincas/${id}`);
    return response.data;
}; 