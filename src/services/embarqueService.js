import api, { getAll, getById, create, update, remove } from './api';

export const getAllEmbarques = async () => {
    return await getAll('embarques');
};

export const getEmbarqueById = async (id) => {
    return await getById('embarques', id);
};

export const createEmbarque = async (embarque) => {
    return await create('embarques', embarque);
};

export const updateEmbarque = async (id, embarque) => {
    console.log('enviandoooo:', embarque)
    const response = await api.put(`/embarques/${id}`, embarque);
    console.log(response.data)
    return response.data;
};

export const deleteEmbarque = async (id) => {
    return await remove('embarques', id);
}; 