import api from '../config/axios';
import { selecciones } from '../data/tempData';
import Seleccion from '../models/Seleccion';

// Obtener todas las selecciones
export const getAllSelecciones = async () => {
    try {
        const response = await api.get('/selecciones');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener selecciones:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las selecciones');
    }
};

// Obtener una selección por ID
export const getSeleccionById = async (id) => {
    try {
        const response = await api.get(`/selecciones/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener selección:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener la selección');
    }
};

// Crear una selección
export const createSeleccion = async (data) => {
    try {
        const response = await api.post('/selecciones', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear selección:', error);
        throw new Error(error.response?.data?.message || 'Error al crear la selección');
    }
};

// Actualizar una selección
export const updateSeleccion = async (id, data) => {
    try {
        const response = await api.put(`/selecciones/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar selección:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar la selección');
    }
};

// Eliminar una selección
export const deleteSeleccion = async (id) => {
    try {
        const response = await api.delete(`/selecciones/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar selección:', error);
        throw new Error(error.response?.data?.message || 'Error al eliminar la selección');
    }
};

// Simular un pequeño retraso para imitar una llamada API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
    await delay(500);
    return selecciones.map(data => new Seleccion(data));
};

export const getById = async (id) => {
    await delay(300);
    const data = selecciones.find(s => s.id === id);
    return data ? new Seleccion(data) : null;
};

export const create = async (seleccionData) => {
    await delay(500);
    const newId = Math.max(...selecciones.map(s => s.id)) + 1;
    const newSeleccion = {
        id: newId,
        ...seleccionData
    };
    selecciones.push(newSeleccion);
    return new Seleccion(newSeleccion);
};

export const update = async (id, seleccionData) => {
    await delay(500);
    const index = selecciones.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const updatedSeleccion = {
        ...selecciones[index],
        ...seleccionData,
        id
    };
    selecciones[index] = updatedSeleccion;
    return new Seleccion(updatedSeleccion);
};

export const remove = async (id) => {
    await delay(300);
    const index = selecciones.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    selecciones.splice(index, 1);
    return true;
}; 