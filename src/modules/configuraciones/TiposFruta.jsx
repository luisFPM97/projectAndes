import React, { useState, useEffect } from 'react';
import { getAllTipofrutas, deleteTipofruta } from '../../services/tipofrutaService';
import TipoFrutaForm from './TipoFrutaForm';

const TiposFruta = () => {
    const [tiposFruta, setTiposFruta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTipoFrutaId, setSelectedTipoFrutaId] = useState(null);

    useEffect(() => {
        loadTiposFruta();
    }, []);

    const loadTiposFruta = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTipofrutas();
            setTiposFruta(data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError(err.message || 'Error al cargar los tipos de fruta');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        setSelectedTipoFrutaId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este tipo de fruta?')) {
            try {
                const index = tiposFruta.findIndex(t => t.id === id);
                if (index !== -1) {
                    const newTiposFruta = tiposFruta.filter(t => t.id !== id);
                    setTiposFruta(newTiposFruta);
                    loadTiposFruta();
                }
            } catch (err) {
                setError('Error al eliminar el tipo de fruta');
                console.error('Error:', err);
            }
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setSelectedTipoFrutaId(null);
        loadTiposFruta();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedTipoFrutaId(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tipos de Fruta</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Tipo de Fruta
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <TipoFrutaForm
                    tipoFrutaId={selectedTipoFrutaId}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tiposFruta.map((tipoFruta) => (
                                <tr key={tipoFruta.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tipoFruta.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tipoFruta.codigo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(tipoFruta.id)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            hidden
                                            onClick={() => handleDelete(tipoFruta.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TiposFruta; 