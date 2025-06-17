import React, { useState, useEffect } from 'react';
import { getAllEmbarques, deleteEmbarque } from '../../services/embarqueService';
import EmbarqueForm from './EmbarqueForm';

const Embarques = () => {
    const [embarquesList, setEmbarquesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmbarqueId, setSelectedEmbarqueId] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

    useEffect(() => {
        loadEmbarques();
    }, []);

    const loadEmbarques = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllEmbarques();
            if (Array.isArray(data)) {
                setEmbarquesList(data);
            } else {
                setEmbarquesList([]);
                setError('Los datos recibidos no tienen el formato esperado');
            }
        } catch (err) {
            setError('Error al cargar los embarques');
            console.error('Error:', err);
            setEmbarquesList([]);
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
        if (!sortConfig.key) return embarquesList;

        return [...embarquesList].sort((a, b) => {
            if (sortConfig.key === 'fechaDespacho') {
                const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key]) : new Date(0);
                const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key]) : new Date(0);
                return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
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
        setSelectedEmbarqueId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este embarque?')) {
            try {
                setLoading(true);
                await deleteEmbarque(id);
                await loadEmbarques();
            } catch (err) {
                setError('Error al eliminar el embarque');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedEmbarqueId(null);
        await loadEmbarques();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedEmbarqueId(null);
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
                <h1 className="text-2xl font-bold text-gray-800">Embarques</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Embarque
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <EmbarqueForm
                    embarqueId={selectedEmbarqueId}
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
                                        onClick={() => handleSort('numero')}
                                    >
                                        Número de Embarque {getSortIcon('numero')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('fechaDespacho')}
                                    >
                                        Fecha de Despacho {getSortIcon('fechaDespacho')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSortedData().map((embarque) => (
                                    <tr key={embarque.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embarque.numero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embarque.fechaDespacho ? new Date(embarque.fechaDespacho).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(embarque.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                            hidden
                                                onClick={() => handleDelete(embarque.id)}
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

export default Embarques; 