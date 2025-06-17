import api from '../config/axios';

// Asegúrate de que esta URL coincida con la URL de tu servidor backend
const API_URL = 'http://localhost:5000/api';

// Configuración global de axios
api.defaults.timeout = 5000; // 5 segundos de timeout

export const getAllLotes = async () => {
    const response = await api.get('/lotes');
    console.log(response.data)
    return response.data;
    
};

export const getLoteById = async (id) => {
    const response = await api.get(`/lotes/${id}`);
    return response.data;
};

export const createLote = async (data) => {
    const response = await api.post('/lotes', data);
    return response.data;
};

export const updateLote = async (id, data) => {
    const response = await api.put(`/lotes/${id}`, data);
    return response.data;
};

export const deleteLote = async (id) => {
    const response = await api.delete(`/lotes/${id}`);
    return response.data;
}; 