import { recepciones } from '../data/tempData';
import Recepcion from '../models/Recepcion';

// Simular un pequeño retraso para imitar una llamada API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
    await delay(500);
    return recepciones.map(data => new Recepcion(data));
};

export const getById = async (id) => {
    await delay(300);
    const data = recepciones.find(r => r.id === id);
    return data ? new Recepcion(data) : null;
};

export const create = async (recepcionData) => {
    await delay(500);
    const newId = Math.max(...recepciones.map(r => r.id)) + 1;
    const newRecepcion = {
        id: newId,
        ...recepcionData
    };
    recepciones.push(newRecepcion);
    return new Recepcion(newRecepcion);
};

export const update = async (id, recepcionData) => {
    await delay(500);
    const index = recepciones.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const updatedRecepcion = {
        ...recepciones[index],
        ...recepcionData,
        id
    };
    recepciones[index] = updatedRecepcion;
    return new Recepcion(updatedRecepcion);
};

export const remove = async (id) => {
    await delay(300);
    const index = recepciones.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    recepciones.splice(index, 1);
    return true;
}; 