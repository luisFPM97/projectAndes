import React, { useState } from 'react';
import CertificacionForm from './CertificacionForm';

const Certificaciones = () => {
    const [certificaciones, setCertificaciones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCertificacionId, setSelectedCertificacionId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortConfig({ key, direction });
    };

    const getSortedAndFilteredCertificaciones = () => {
        let sortedCertificaciones = [...certificaciones];

        if (sortConfig.key) {
            sortedCertificaciones.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        if (searchTerm) {
            sortedCertificaciones = sortedCertificaciones.filter(certificacion =>
                certificacion.numero.includes(searchTerm) || certificacion.nombre.includes(searchTerm)
            );
        }

        return sortedCertificaciones;
    };

    const handleSave = (certificacion) => {
        // Implement the logic to save the certificacion
    };

    const handleDelete = (id) => {
        // Implement the logic to delete the certificacion
    };

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
                    placeholder="Buscar por número o nombre..."
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
                                        onClick={() => handleSort('nombre')}
                                    >
                                        Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                        onClick={() => handleSort('fechaInicio')}
                                    >
                                        Fecha Inicio {sortConfig.key === 'fechaInicio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                        onClick={() => handleSort('fechaFin')}
                                    >
                                        Fecha Fin {sortConfig.key === 'fechaFin' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getSortedAndFilteredCertificaciones().map(certificacion => (
                                    <tr key={certificacion.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {certificacion.numero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {certificacion.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(certificacion.fechaInicio).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(certificacion.fechaFin).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedCertificacionId(certificacion.id);
                                                    setShowForm(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(certificacion.id)}
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
                        <CertificacionForm
                            certificacionId={selectedCertificacionId}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedCertificacionId(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificaciones; 