import api from '../config/axios';

export const getAllGGNs = async () => {
    const response = await api.get('/ggns');
    return response.data;
};

export const getByIdGGN = async (id) => {
    const response = await api.get(`/ggns/${id}`);
    return response.data;
};

export const createGGN = async (data) => {
    const response = await api.post('/ggns', data);
    return response.data;
};

export const updateGGN = async (id, data) => {
    const response = await api.put(`/ggns/${id}`, data);
    return response.data;
};

export const deleteGGN = async (id) => {
    const response = await api.delete(`/ggns/${id}`);
    return response.data;
}; 