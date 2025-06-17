import React, { useState, useEffect } from 'react';
import { create, update, getById, getAll } from '../../services/api';
import Recepcion from '../../models/Recepcion';

const SeleccionForm = ({ seleccionId, onSave }) => {
    const [formData, setFormData] = useState({
        id_recepcion: '',
        fecha_seleccion: '',
        magullado: 0,
        rajado: 0,
        botritis: 0
    });

    const [recepciones, setRecepciones] = useState([]);

    useEffect(() => {
        loadData();
        if (seleccionId) {
            loadSeleccion();
        }
    }, [seleccionId]);

    const loadData = async () => {
        try {
            const recepcionesData = await getAll('recepciones');
            setRecepciones(recepcionesData.map(r => Recepcion.fromJSON(r)));
        } catch (error) {
            console.error('Error cargando recepciones:', error);
        }
    };

    const loadSeleccion = async () => {
        try {
            const data = await getById('selecciones', seleccionId);
            setFormData(data);
        } catch (error) {
            console.error('Error cargando selección:', error);
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
            if (seleccionId) {
                await update('selecciones', seleccionId, formData);
            } else {
                await create('selecciones', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error guardando selección:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700">Fecha de Selección</label>
                    <input
                        type="date"
                        name="fecha_seleccion"
                        value={formData.fecha_seleccion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Magullado (%)</label>
                    <input
                        type="number"
                        name="magullado"
                        value={formData.magullado}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rajado (%)</label>
                    <input
                        type="number"
                        name="rajado"
                        value={formData.rajado}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Botritis (%)</label>
                    <input
                        type="number"
                        name="botritis"
                        value={formData.botritis}
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
                    {seleccionId ? 'Actualizar' : 'Crear'} Selección
                </button>
            </div>
        </form>
    );
};

export default SeleccionForm; 