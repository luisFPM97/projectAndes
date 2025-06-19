import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { getAllGGNs } from '../../services/ggnService';
import api from '../../config/axios';
import GGNForm from './GGNForm';

const GGN = () => {
    const [ggns, setGGNs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedGGN, setSelectedGGN] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchGGNs = async () => {
        try {
            setLoading(true);
            const data = await getAllGGNs();
            setGGNs(data);
        } catch (err) {
            setError('Error al cargar los GGN');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGGNs();
    }, []);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSort = (key) => {
        const direction = sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortConfig({ key, direction });
    };
    const getSortedAndFilteredGGNs = () => {
        let sorted = [...ggns];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        if (searchTerm) {
            sorted = sorted.filter(g =>
                g.numero.includes(searchTerm) ||
                (g.Productor && g.Productor.nombre && g.Productor.nombre.includes(searchTerm))
            );
        }
        return sorted;
    };

    const handleSave = async (form) => {
        try {
            setLoading(true);
            if (selectedGGN) {
                // Editar
                await api.put(`/ggns/${selectedGGN.id}`, {
                    numero: form.numero,
                    fechaEmision: form.fechaEmision,
                    fechaVencimiento: form.fechaVencimiento,
                    productorId: form.productorId
                });
            } else {
                // Crear
                await api.post('/ggns', {
                    numero: form.numero,
                    fechaEmision: form.fechaEmision,
                    fechaVencimiento: form.fechaVencimiento,
                    productorId: form.productorId
                });
            }
            setShowForm(false);
            setSelectedGGN(null);
            await fetchGGNs();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el GGN');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ggn) => {
        setSelectedGGN({
            ...ggn,
            productorId: ggn.productorId || ggn.Productor?.id || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await api.delete(`/ggns/${id}`);
            await fetchGGNs();
        } catch (err) {
            setError('Error al eliminar el GGN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex justify-between items-center mb-6">
                    <CardTitle>GGN</CardTitle>
                    <button
                        onClick={() => { setShowForm(true); setSelectedGGN(null); }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        + Nuevo GGN
                    </button>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
                    )}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por número o productor..."
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('numero')}>
                                                Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('productor')}>
                                                Productor {sortConfig.key === 'productor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('fechaEmision')}>
                                                Fecha Emisión {sortConfig.key === 'fechaEmision' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('fechaVencimiento')}>
                                                Fecha Vencimiento {sortConfig.key === 'fechaVencimiento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getSortedAndFilteredGGNs().map(ggn => (
                                            <tr key={ggn.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.numero}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.productor?.nombre || ''}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.fechaEmision?.slice(0,10)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.fechaVencimiento?.slice(0,10)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleEdit(ggn)} className="text-blue-500 hover:text-blue-700 mr-4">Editar</button>
                                                    <button onClick={() => handleDelete(ggn.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <GGNForm
                            initialData={selectedGGN}
                            onSave={handleSave}
                            onCancel={() => { setShowForm(false); setSelectedGGN(null); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GGN; 