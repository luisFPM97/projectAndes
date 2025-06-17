import React, { useState, useEffect } from 'react';
import { getById, create, update } from '../../services/certicaService';

const CerticaForm = ({ certicaId, fincaId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        fechaEmision: '',
        fechaVencimiento: '',
        fincaId: fincaId || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (certicaId) {
            loadCertica();
        }
    }, [certicaId]);

    const loadCertica = async () => {
        try {
            setLoading(true);
            const certica = await getById(certicaId);
            setFormData({
                numero: certica.numero,
                fechaEmision: new Date(certica.fechaEmision).toISOString().split('T')[0],
                fechaVencimiento: new Date(certica.fechaVencimiento).toISOString().split('T')[0],
                fincaId: certica.fincaId
            });
        } catch (err) {
            setError('Error al cargar la certificación');
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (certicaId) {
                await update(certicaId, formData);
            } else {
                await create(formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la certificación');
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
                    {certicaId ? 'Editar Certificación' : 'Nueva Certificación'}
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
                        Número de Certificación
                    </label>
                    <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Emisión
                    </label>
                    <input
                        type="date"
                        name="fechaEmision"
                        value={formData.fechaEmision}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Vencimiento
                    </label>
                    <input
                        type="date"
                        name="fechaVencimiento"
                        value={formData.fechaVencimiento}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-4">
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

export default CerticaForm; 