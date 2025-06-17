import React, { useState, useEffect } from 'react';
import { createLote, updateLote, getLoteById } from '../../services/loteService';

const LoteForm = ({ loteId, fincaId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        fincaId: fincaId
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loteId) {
            loadLote();
        }
    }, [loteId]);

    const loadLote = async () => {
        try {
            setLoading(true);
            const data = await getLoteById(loteId);
            if (data) {
                setFormData({
                    numero: data.numero || '',
                    fincaId: data.fincaId
                });
            }
        } catch (err) {
            setError('Error al cargar los datos del lote');
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
            const dataToSend = {
                numero: formData.numero,
                fincaId: formData.fincaId
            };
            
            if (loteId) {
                await updateLote(loteId, dataToSend);
            } else {
                await createLote(dataToSend);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar el lote');
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
                {loteId ? 'Editar Lote' : 'Nuevo Lote'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                        Número de Lote
                    </label>
                    <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        pattern="[0-9]{2}"
                        maxLength="2"
                        placeholder="Ej: 01"
                    />
                    <p className="text-sm text-gray-500 mt-1">Ingrese un número de 2 dígitos</p>
                </div>

                <div className="flex justify-end space-x-4">
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

export default LoteForm; 