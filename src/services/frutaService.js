import api from '../config/axios';

export const getAllFrutas = async () => {
    const response = await api.get('/frutas');
    console.log(response.data);
    return response.data;
};

export const getFrutaById = async (id) => {
    const response = await api.get(`/frutas/${id}`);
    return response.data;
};

export const createFruta = async (data) => {
    const response = await api.post('/frutas', data);
    return response.data;
};

export const updateFruta = async (id, data) => {
    const response = await api.put(`/frutas/${id}`, data);
    return response.data;
};

export const deleteFruta = async (id) => {
    const response = await api.delete(`/frutas/${id}`);
    return response.data;
};

export const asignarFrutaALote = async (loteId, data) => {
    const response = await api.put(`/frutas/${data.frutaId}`, {
        lotes: [{
            loteId: loteId,
            fechaSiembra: data.fechaSiembra,
            cantidadPlantas: data.cantidadPlantas,
            estado: data.estado,
            observaciones: data.observaciones
        }]
    });
    console.log(response.data);
    return response.data;
}; 