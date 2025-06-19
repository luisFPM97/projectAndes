import React, { useState, useEffect } from 'react';
import FacturaForm from './FacturaForm';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { getAllFacturas } from '../../services/facturaService';
import api from '../../config/axios';

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedFactura, setSelectedFactura] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFacturas = async () => {
        try {
            setLoading(true);
            const data = await getAllFacturas();
            setFacturas(data);
        } catch (err) {
            setError('Error al cargar las facturas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortConfig({ key, direction });
    };

    const getSortedAndFilteredFacturas = () => {
        let sortedFacturas = [...facturas];

        if (sortConfig.key) {
            sortedFacturas.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        if (searchTerm) {
            sortedFacturas = sortedFacturas.filter(factura =>
                factura.numero.includes(searchTerm) ||
                (factura.descripcion && factura.descripcion.includes(searchTerm)) ||
                (factura.embarque && factura.embarque.numero && factura.embarque.numero.includes(searchTerm))
            );
        }

        return sortedFacturas;
    };

    const handleSave = async (form) => {
        try {
            setLoading(true);
            if (selectedFactura) {
                // Editar
                await api.put(`/facturas/${selectedFactura.id}`, {
                    numero: form.numero,
                    descripcion: form.descripcion,
                    embarqueId: form.embarqueId
                });
            } else {
                // Crear
                await api.post('/facturas', {
                    numero: form.numero,
                    descripcion: form.descripcion,
                    embarqueId: form.embarqueId
                });
            }
            setShowForm(false);
            setSelectedFactura(null);
            await fetchFacturas();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la factura');
            console.error('Error al crear factura:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (factura) => {
        setSelectedFactura({
            ...factura,
            embarqueId: factura.embarqueId || factura.embarque?.id || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta factura?')) return;
        try {
            setLoading(true);
            await api.delete(`/facturas/${id}`);
            await fetchFacturas();
        } catch (err) {
            setError('Error al eliminar la factura');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex justify-between items-center mb-6">
                    <CardTitle>Facturas</CardTitle>
                    <button
                        onClick={() => { setShowForm(true); setSelectedFactura(null); }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        + Nueva Factura
                    </button>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por número, descripción o embarque..."
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
                                                onClick={() => handleSort('numero')}
                                            >
                                                Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                                onClick={() => handleSort('descripcion')}
                                            >
                                                Descripción {sortConfig.key === 'descripcion' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                                onClick={() => handleSort('embarque')}
                                            >
                                                Embarque {sortConfig.key === 'embarque' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getSortedAndFilteredFacturas().map(factura => (
                                            <tr key={factura.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {factura.numero}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {factura.descripcion}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {factura.embarque?.numero}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(factura)}
                                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(factura.id)}
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
                </CardContent>
            </Card>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
                        <FacturaForm
                            factura={selectedFactura}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedFactura(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Facturas; 