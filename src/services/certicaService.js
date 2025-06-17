import api from '../config/axios';

export const getAllCerticas = async () => {
    const response = await api.get('/certicas');
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`/certicas/${id}`);
    return response.data;
};

export const create = async (data) => {
    const response = await api.post('/certicas', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/certicas/${id}`, data);
    return response.data;
};

export const deleteCertica = async (id) => {
    const response = await api.delete(`/certicas/${id}`);
    return response.data;
}; 