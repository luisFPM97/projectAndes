import api from "./api";


export const getAllTipoPresentaciones = async () => {
    const response = await api.get('/tipopresentaciones')
    return response.data;
};

export const getTipoPresentacionById = async (id) => {
    const response = await axios.get(`/tipopresentaciones/${id}`);
    console.log(response.data)
    return response.data;
};

export const createTipoPresentacion = async (tipoPresentacion) => {
    const response = await api.post('/tipopresentaciones', tipoPresentacion);
    return response.data;
};

export const updateTipoPresentacion = async (id, tipoPresentacion) => {
    const response = await api.put(`/tipopresentaciones/${id}`, tipoPresentacion);
    return response.data;
};

export const deleteTipoPresentacion = async (id) => {
    const response = await api.delete(`/tipopresentaciones/${id}`);
    return response.data;
}; 