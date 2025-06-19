import api from '../config/axios';

export const getAllGGNs = async () => {
    const response = await api.get('/ggns');
    return response.data;
}; 