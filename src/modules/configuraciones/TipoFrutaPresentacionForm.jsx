import React, { useState, useEffect } from 'react';
import { tipos_fruta_pres } from '../../data/tempData';

const TipoFrutaPresentacionForm = ({ tipoFrutaPresId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        kg_empacado: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tipoFrutaPresId) {
            loadTipoFrutaPres();
        }
    }, [tipoFrutaPresId]);

    const loadTipoFrutaPres = () => {
        const tipoFrutaPres = tipos_fruta_pres.find(t => t.id === tipoFrutaPresId);
        if (tipoFrutaPres) {
            setFormData({
                nombre: tipoFrutaPres.nombre || '',
                kg_empacado: tipoFrutaPres.kg_empacado || ''
            });
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
            if (tipoFrutaPresId) {
                // Actualizar tipo de fruta presentación existente
                const index = tipos_fruta_pres.findIndex(t => t.id === tipoFrutaPresId);
                if (index !== -1) {
                    tipos_fruta_pres[index] = { ...tipos_fruta_pres[index], ...formData };
                }
            } else {
                // Crear nuevo tipo de fruta presentación
                const newId = Math.max(...tipos_fruta_pres.map(t => t.id)) + 1;
                const newTipoFrutaPres = {
                    id: newId,
                    ...formData
                };
                tipos_fruta_pres.push(newTipoFrutaPres);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar el tipo de fruta presentación');
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
                {tipoFrutaPresId ? 'Editar Tipo de Fruta Presentación' : 'Nuevo Tipo de Fruta Presentación'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kg_empacado">
                            Kilogramos Empacados
                        </label>
                        <input
                            type="number"
                            id="kg_empacado"
                            name="kg_empacado"
                            value={formData.kg_empacado}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
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

export default TipoFrutaPresentacionForm; 