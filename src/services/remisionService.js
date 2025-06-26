import  { api, create, getAll, getById, update, remove } from './api';

// Obtener todas las remisiones (con filtro de fechas opcional)
export const getAllRemisiones = async (startDate, endDate) => {
    let url = '/remisiones';
    if (startDate && endDate) {
        url += `?fechaInicio=${startDate}&fechaFin=${endDate}`;
    }
    const response = await api.get(url);
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
    
    const response = await api.put(`/remisiones/${id}`, remision)
    console.log(response.data)
    return response.data;
    
    
};

// Eliminar una remisión
export const deleteRemision = async (id) => {
    const response = await api.delete(`/remisiones/${id}`);
    return response.data;
}; 