import React, { useState, useEffect } from 'react';
import { getAllTipoPresentaciones, deleteTipoPresentacion } from '../../services/tipoPresentacionService';
import TipoPresentacionForm from './TipoPresentacionForm';

const TipoPresentaciones = () => {
    const [tiposList, setTiposList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedTipoId, setSelectedTipoId] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTipoPresentaciones();
            if (Array.isArray(data)) {
                setTiposList(data);
            } else {
                setTiposList([]);
                setError('Los datos recibidos no tienen el formato esperado');
            }
        } catch (err) {
            setError('Error al cargar los tipos de presentación');
            console.error('Error:', err);
            setTiposList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key) return tiposList;

        return [...tiposList].sort((a, b) => {
            if (sortConfig.key === 'kg') {
                const kgA = parseFloat(a[sortConfig.key]);
                const kgB = parseFloat(b[sortConfig.key]);
                return sortConfig.direction === 'ascending' ? kgA - kgB : kgB - kgA;
            }

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    const handleEdit = (id) => {
        setSelectedTipoId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este tipo de presentación?')) {
            try {
                setLoading(true);
                await deleteTipoPresentacion(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar el tipo de presentación');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedTipoId(null);
        await loadData();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedTipoId(null);
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
                <h1 className="text-2xl font-bold text-gray-800">Tipos de Presentación</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Tipo
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <TipoPresentacionForm
                    tipoId={selectedTipoId}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('nombre')}
                                    >
                                        Nombre {getSortIcon('nombre')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('kg')}
                                    >
                                        Peso (kg) {getSortIcon('kg')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSortedData().map((tipo) => (
                                    <tr key={tipo.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tipo.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(tipo.kg).toFixed(2)} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(tipo.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                            hidden
                                                onClick={() => handleDelete(tipo.id)}
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

export default TipoPresentaciones; 