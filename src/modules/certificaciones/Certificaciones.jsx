import React, { useState, useEffect } from 'react';
import { getAllCerticas, getById, create, update, deleteCertica } from '../../services/certicaService';
import { getAllFincas } from '../../services/fincaService';
import CerticaForm from './CerticaForm';

const Certificaciones = () => {
    const [certificaciones, setCertificaciones] = useState([]);
    const [fincas, setFincas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCerticaId, setSelectedCerticaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'numero',
        direction: 'asc'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [certificacionesData, fincasData] = await Promise.all([
                getAllCerticas(),
                getAllFincas()
            ]);
            setCertificaciones(certificacionesData);
            setFincas(fincasData);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta certificación?')) {
            try {
                setLoading(true);
                await deleteCertica(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar la certificación');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedCerticaId(null);
        await loadData();
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

    const getSortedAndFilteredCertificaciones = () => {
        let filteredCertificaciones = certificaciones;

        // Aplicar filtro de búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredCertificaciones = certificaciones.filter(certica => 
                certica.numero.toLowerCase().includes(searchLower) ||
                certica.finca?.nombre.toLowerCase().includes(searchLower) ||
                certica.finca?.Productor?.nombre.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar ordenamiento
        return [...filteredCertificaciones].sort((a, b) => {
            if (sortConfig.key === 'numero') {
                if (sortConfig.direction === 'asc') {
                    return a.numero.localeCompare(b.numero);
                }
                return b.numero.localeCompare(a.numero);
            }
            if (sortConfig.key === 'fechaEmision') {
                if (sortConfig.direction === 'asc') {
                    return new Date(a.fechaEmision) - new Date(b.fechaEmision);
                }
                return new Date(b.fechaEmision) - new Date(a.fechaEmision);
            }
            if (sortConfig.key === 'fechaVencimiento') {
                if (sortConfig.direction === 'asc') {
                    return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
                }
                return new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento);
            }
            return 0;
        });
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
                <h1 className="text-2xl font-bold">Certificaciones</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Nueva Certificación
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
                    placeholder="Buscar por número, finca o productor..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('numero')}
                            >
                                Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Finca
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productor
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('fechaEmision')}
                            >
                                Fecha Emisión {sortConfig.key === 'fechaEmision' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('fechaVencimiento')}
                            >
                                Fecha Vencimiento {sortConfig.key === 'fechaVencimiento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getSortedAndFilteredCertificaciones().map(certica => (
                            <tr key={certica.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {certica.numero}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {certica.finca?.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {certica.finca?.productor?.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(certica.fechaEmision).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(certica.fechaVencimiento).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        new Date(certica.fechaVencimiento) > new Date()
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {new Date(certica.fechaVencimiento) > new Date() ? 'Vigente' : 'Vencido'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedCerticaId(certica.id);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                    hidden
                                        onClick={() => handleDelete(certica.id)}
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

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <CerticaForm
                            certicaId={selectedCerticaId}
                            fincas={fincas}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedCerticaId(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificaciones; 