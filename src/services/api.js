import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const create = async (endpoint, data) => {
    try {
        const response = await api.post(`/${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAll = async (endpoint) => {
    try {
        const response = await api.get(`/${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getById = async (endpoint, id) => {
    try {
        const response = await api.get(`/${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const update = async (endpoint, id, data) => {
    const isConfirmed = confirm("¿Estás seguro que deseas continuar?");

    if (!isConfirmed) {
        alert("operacion cancelada")
        return null;
    }

    try {
        const response = await api.put(`${endpoint}/${id}`, data);
        
        return response.data;
        
    } catch (error) {
        throw error;
    }
};

export const remove = async (endpoint, id) => {
    try {
        const response = await api.delete(`/${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api; 