import React, { useState, useEffect } from 'react';
import { getTipofrutaById, createTipofruta, updateTipofruta } from '../../services/tipofrutaService';

const TipoFrutaForm = ({ tipofrutaId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tipofrutaId) {
            loadTipofruta();
        }
    }, [tipofrutaId]);

    const loadTipofruta = async () => {
        try {
            setLoading(true);
            const tipofruta = await getTipofrutaById(tipofrutaId);
            setFormData({
                nombre: tipofruta.nombre
            });
        } catch (err) {
            setError('Error al cargar el tipo de fruta');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (tipofrutaId) {
                await updateTipofruta(tipofrutaId, formData);
            } else {
                await createTipofruta(formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el tipo de fruta');
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {tipofrutaId ? 'Editar Tipo de Fruta' : 'Nuevo Tipo de Fruta'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TipoFrutaForm; 