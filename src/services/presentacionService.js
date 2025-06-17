
import api from "../config/axios";

export const getAllPresentaciones = async () => {
    const response = await api.get('/presentaciones');
    console.log(response.data)
    return response.data;
};

export const getPresentacionById = async (id) => {
    const response = await api.get(`/presentaciones/${id}`);
    return response.data;
};

export const createPresentacion = async (presentacion) => {
    const response = await api.post('/presentaciones', presentacion);
    return response.data;
};

export const updatePresentacion = async (id, presentacion) => {
    const response = await api.put(`/presentaciones/${id}`, presentacion);
    return response.data;
};

export const deletePresentacion = async (id) => {
    const response = await api.delete(`/presentaciones/${id}`);
    return response.data;
}; 