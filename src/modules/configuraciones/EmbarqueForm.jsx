import React, { useState, useEffect } from 'react';
import { getEmbarqueById, createEmbarque, updateEmbarque } from '../../services/embarqueService';

const EmbarqueForm = ({ embarqueId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        fechaDespacho: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (embarqueId) {
            loadEmbarque();
        }
    }, [embarqueId]);

    const loadEmbarque = async () => {
        try {
            setLoading(true);
            const embarque = await getEmbarqueById(embarqueId);
            console.log(embarque)
            if (embarque) {
                setFormData({
                    numero: embarque.numero ,
                    fechaDespacho: embarque.fechaDespacho 
                });
            }
        } catch (err) {
            setError('Error al cargar el embarque');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (embarqueId) {
                console.log(formData)
                await updateEmbarque(embarqueId, formData);
            } else {
                await createEmbarque(formData);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar el embarque');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {embarqueId ? 'Editar Embarque' : 'Nuevo Embarque'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                            Número de Embarque
                        </label>
                        <input
                            type="text"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaDespacho">
                            Fecha de Despacho
                        </label>
                        <input
                            type="date"
                            id="fechaDespacho"
                            name="fechaDespacho"
                            value={formData.fechaDespacho}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmbarqueForm; 