import React, { useState, useEffect } from 'react';
import { getAllFrutas, deleteFruta} from '../../services/frutaService';
import FrutaForm from './FrutaForm';

const Frutas = () => {
    const [frutas, setFrutas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedFrutaId, setSelectedFrutaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'nombre',
        direction: 'asc'
    });
    const [formData, setFormData] = useState({
        frutaId: '',
        fechaSiembra: '',
        cantidadPlantas: '',
        estado: 'activo',
        observaciones: ''
    });

    useEffect(() => {
        loadFrutas();
    }, []);

    const loadFrutas = async () => {
        try {
            const frutasData = await getAllFrutas();
            setFrutas(frutasData);
        } catch (err) {
            setError('Error al cargar las frutas');
            console.error('Error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta fruta?')) {
            try {
                setLoading(true);
                await deleteFruta(id);
                await loadFrutas();
            } catch (err) {
                setError('Error al eliminar la fruta');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedFrutaId(null);
        await loadFrutas();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const getSortedAndFilteredFrutas = () => {
        let filteredFrutas = frutas;

        // Aplicar filtro de búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredFrutas = frutas.filter(fruta => 
                fruta.nombre.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar ordenamiento
        return [...filteredFrutas].sort((a, b) => {
            if (sortConfig.key === 'nombre') {
                if (sortConfig.direction === 'asc') {
                    return a.nombre.localeCompare(b.nombre);
                }
                return b.nombre.localeCompare(a.nombre);
            }
            return 0;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await asignarFrutaALote(lote.id, formData);
            onSave();
        } catch (err) {
            setError('Error al asignar la fruta al lote');
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Frutas</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Nueva Fruta
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <FrutaForm
                            frutaId={selectedFrutaId}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedFrutaId(null);
                            }}
                        />
                    </div>
                </div>
            ) : (
                <>
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
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('nombre')}
                                    >
                                        Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSortedAndFilteredFrutas().map(fruta => (
                                    <tr key={fruta.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {fruta.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedFrutaId(fruta.id);
                                                    setShowForm(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                            hidden
                                                onClick={() => handleDelete(fruta.id)}
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
                </>
            )}
        </div>
    );
};

export default Frutas; 