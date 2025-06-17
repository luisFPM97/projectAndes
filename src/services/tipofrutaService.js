import api from '../config/axios';

// Obtener todos los tipos de fruta
export const getAllTipofrutas = async () => {
    try {
        const response = await api.get('/tipofrutas');
        return response.data || [];
    } catch (error) {
        console.error('Error al obtener tipos de fruta:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los tipos de fruta');
    }
};

// Obtener un tipo de fruta por ID
export const getTipofrutaById = async (id) => {
    try {
        const response = await api.get(`/tipofrutas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipo de fruta:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener el tipo de fruta');
    }
};

// Crear un nuevo tipo de fruta
export const createTipofruta = async (data) => {
    try {
        const response = await api.post('/tipofrutas', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear tipo de fruta:', error);
        throw new Error(error.response?.data?.message || 'Error al crear el tipo de fruta');
    }
};

// Actualizar un tipo de fruta
export const updateTipofruta = async (id, data) => {
    try {
        const response = await api.put(`/tipofrutas/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar tipo de fruta:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el tipo de fruta');
    }
};

// Eliminar un tipo de fruta
export const deleteTipofruta = async (id) => {
    try {
        const response = await api.delete(`/tipofrutas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar tipo de fruta:', error);
        throw new Error(error.response?.data?.message || 'Error al eliminar el tipo de fruta');
    }
}; 