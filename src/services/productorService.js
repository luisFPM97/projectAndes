import api from '../config/axios';

// Simular un pequeño retraso para imitar una llamada API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
    const response = await api.get('/productor');
    return response.data;
};

export const getById = async (id) => {
    const response = await api.get(`/productor/${id}`);
    return response.data;
};

export const create = async (data) => {
    const response = await api.post('/productor', data);
    return response.data;
};

export const update = async (id, data) => {
    const response = await api.put(`/productor/${id}`, data);
    return response.data;
};

export const remove = async (id) => {
    const response = await api.delete(`/productor/${id}`);
    return response.data;
}; 