import { 
    recepciones, 
    presentaciones, 
    tiposFrutaPres, 
    embarques 
} from '../data/tempData';

// Simular un pequeño retraso para imitar una llamada API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getRecepcionesDisponibles = async () => {
    await delay(300);
    // Filtrar recepciones que no tienen selección
    return recepciones.filter(r => !r.id_seleccion);
};

export const getPresentaciones = async () => {
    await delay(300);
    return presentaciones;
};

export const getTiposFrutaPres = async () => {
    await delay(300);
    return tiposFrutaPres;
};

export const getEmbarques = async () => {
    await delay(300);
    return embarques;
}; 