import React, { useState, useEffect } from 'react';
import { getAllTipofrutas, deleteTipofruta } from '../../services/tipofrutaService';
import TipoFrutaForm from './TipoFrutaForm';

const TipoFruta = () => {
    const [tipofrutas, setTipofrutas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedTipofrutaId, setSelectedTipofrutaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTipofrutas();
            setTipofrutas(data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError(err.message || 'Error al cargar los tipos de fruta');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortConfig({ key, direction });
    };

    const getSortedAndFilteredTipofrutas = () => {
        let sortedTipofrutas = [...tipofrutas];

        if (sortConfig.key) {
            sortedTipofrutas.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        if (searchTerm) {
            sortedTipofrutas = sortedTipofrutas.filter(tipofruta =>
                tipofruta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return sortedTipofrutas;
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este tipo de fruta?')) {
            try {
                setLoading(true);
                await deleteTipofruta(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar el tipo de fruta');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedTipofrutaId(null);
        await loadData();
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
                <h1 className="text-2xl font-bold">Tipos de Fruta</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Nuevo Tipo de Fruta
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-w-full">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                        onClick={() => handleSort('nombre')}
                                    >
                                        Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSortedAndFilteredTipofrutas().map(tipofruta => (
                                    <tr key={tipofruta.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {tipofruta.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedTipofrutaId(tipofruta.id);
                                                    setShowForm(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                            hidden
                                                onClick={() => handleDelete(tipofruta.id)}
                                                className="text-red-500 hover:text-red-700"
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
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
                        <TipoFrutaForm
                            tipofrutaId={selectedTipofrutaId}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedTipofrutaId(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipoFruta; 