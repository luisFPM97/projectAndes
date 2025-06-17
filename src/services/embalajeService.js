import api from './api';

export const getAllEmbalajes = async () => {
    const response = await api.get('/embalajes');
    console.log(response.data)
    return response.data;
};

export const getEmbalajeById = async (id) => {
    const response = await api.get(`/embalajes/${id}`);
    return response.data;
};

export const createEmbalaje = async (embalaje) => {
    const response = await api.post('/embalajes', embalaje);
    return response.data;
};

export const updateEmbalaje = async (id, embalaje) => {
    const response = await api.put(`/embalajes/${id}`, embalaje);
    return response.data;
};

export const deleteEmbalaje = async (id) => {
    const response = await api.delete(`/embalajes/${id}`);
    return response.data;
}; 