import React, { useState, useEffect } from 'react';
import { tipos_fruta_pres } from '../../data/tempData';
import TipoFrutaPresentacionForm from './TipoFrutaPresentacionForm';

const TiposFrutaPresentacion = () => {
    const [tiposFrutaPresList, setTiposFrutaPresList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTipoFrutaPresId, setSelectedTipoFrutaPresId] = useState(null);

    useEffect(() => {
        loadTiposFrutaPres();
    }, []);

    const loadTiposFrutaPres = () => {
        try {
            setLoading(true);
            setTiposFrutaPresList(tipos_fruta_pres);
        } catch (err) {
            setError('Error al cargar los tipos de fruta presentación');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        setSelectedTipoFrutaPresId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este tipo de fruta presentación?')) {
            try {
                const index = tipos_fruta_pres.findIndex(t => t.id === id);
                if (index !== -1) {
                    tipos_fruta_pres.splice(index, 1);
                    loadTiposFrutaPres();
                }
            } catch (err) {
                setError('Error al eliminar el tipo de fruta presentación');
                console.error('Error:', err);
            }
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setSelectedTipoFrutaPresId(null);
        loadTiposFrutaPres();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedTipoFrutaPresId(null);
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
                <h1 className="text-2xl font-bold text-gray-800">Tipos de Fruta Presentación</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Tipo de Fruta Presentación
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <TipoFrutaPresentacionForm
                    tipoFrutaPresId={selectedTipoFrutaPresId}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kilogramos Empacados
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tiposFrutaPresList.map((tipoFrutaPres) => (
                                    <tr key={tipoFrutaPres.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tipoFrutaPres.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tipoFrutaPres.kg_empacado}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(tipoFrutaPres.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tipoFrutaPres.id)}
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
                </div>
            )}
        </div>
    );
};

export default TiposFrutaPresentacion; 