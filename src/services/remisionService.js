import  { api, create, getAll, getById, update, remove } from './api';

// Obtener todas las remisiones
export const getAllRemisiones = async () => {
    const response = await api.get('/remisiones');
    return response.data;
};

// Obtener una remisión por ID
export const getRemisionById = async (id) => {
    const response = await api.get(`/remisiones/${id}`);
    return response.data;
};

// Crear una nueva remisión
export const createRemision = async (remision) => {
    const response = await api.post('/remisiones', remision);
    return response.data;
};

// Actualizar una remisión
export const updateRemision = async (id, remision) => {

    return await update(`/remisiones`, id, remision);
    
    
};

// Eliminar una remisión
export const deleteRemision = async (id) => {
    const response = await api.delete(`/remisiones/${id}`);
    return response.data;
}; 