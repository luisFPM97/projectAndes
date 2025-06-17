import React, { useState, useEffect } from 'react';
import { create, update, getById, getAll } from '../../services/api';
import Recepcion from '../../models/Recepcion';
import Presentacion from '../../models/Presentacion';
import TipoFrutaPres from '../../models/TipoFrutaPres';
import Embarque from '../../models/Embarque';

const EmbalajeForm = ({ embalajeId, onSave }) => {
    const [formData, setFormData] = useState({
        estiba: '',
        id_recepcion: '',
        id_embarque: '',
        id_presentacion: '',
        id_tipo_fruta_pres: '',
        numero_cajas: 0,
        kg_empacado: 0,
        porcentaje_empacado: 0
    });

    const [recepciones, setRecepciones] = useState([]);
    const [presentaciones, setPresentaciones] = useState([]);
    const [tiposFrutaPres, setTiposFrutaPres] = useState([]);
    const [embarques, setEmbarques] = useState([]);

    useEffect(() => {
        loadData();
        if (embalajeId) {
            loadEmbalaje();
        }
    }, [embalajeId]);

    const loadData = async () => {
        try {
            const [recepcionesData, presentacionesData, tiposFrutaPresData, embarquesData] = await Promise.all([
                getAll('recepciones'),
                getAll('presentaciones'),
                getAll('tipos-fruta-pres'),
                getAll('embarques')
            ]);

            setRecepciones(recepcionesData.map(r => Recepcion.fromJSON(r)));
            setPresentaciones(presentacionesData.map(p => Presentacion.fromJSON(p)));
            setTiposFrutaPres(tiposFrutaPresData.map(t => TipoFrutaPres.fromJSON(t)));
            setEmbarques(embarquesData.map(e => Embarque.fromJSON(e)));
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    const loadEmbalaje = async () => {
        try {
            const data = await getById('embalajes', embalajeId);
            setFormData(data);
        } catch (error) {
            console.error('Error cargando embalaje:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (embalajeId) {
                await update('embalajes', embalajeId, formData);
            } else {
                await create('embalajes', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error guardando embalaje:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Estiba</label>
                    <input
                        type="number"
                        name="estiba"
                        value={formData.estiba}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recepción</label>
                    <select
                        name="id_recepcion"
                        value={formData.id_recepcion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    >
                        <option value="">Seleccione una recepción</option>
                        {recepciones.map(recepcion => (
                            <option key={recepcion.id} value={recepcion.id}>
                                {`Recepción #${recepcion.n_entrada}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Presentación</label>
                    <select
                        name="id_presentacion"
                        value={formData.id_presentacion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    >
                        <option value="">Seleccione una presentación</option>
                        {presentaciones.map(presentacion => (
                            <option key={presentacion.id} value={presentacion.id}>
                                {presentacion.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Fruta</label>
                    <select
                        name="id_tipo_fruta_pres"
                        value={formData.id_tipo_fruta_pres}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    >
                        <option value="">Seleccione un tipo de fruta</option>
                        {tiposFrutaPres.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Cajas</label>
                    <input
                        type="number"
                        name="numero_cajas"
                        value={formData.numero_cajas}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kg Empacado</label>
                    <input
                        type="number"
                        name="kg_empacado"
                        value={formData.kg_empacado}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Porcentaje Empacado</label>
                    <input
                        type="number"
                        name="porcentaje_empacado"
                        value={formData.porcentaje_empacado}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        step="0.01"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {embalajeId ? 'Actualizar' : 'Crear'} Embalaje
                </button>
            </div>
        </form>
    );
};

export default EmbalajeForm; 