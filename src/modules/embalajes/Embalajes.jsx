import React, { useState, useEffect } from 'react';
import { getAllEmbalajes, deleteEmbalaje } from '../../services/embalajeService';
import EmbalajeForm from './EmbalajeForm';

const Embalajes = () => {
    const [embalajesList, setEmbalajesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmbalajeId, setSelectedEmbalajeId] = useState(null);
    const [filtroEmbarque, setFiltroEmbarque] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllEmbalajes();
            if (Array.isArray(data)) {
                // Ordenar por ID de mayor a menor
                const sortedData = data.sort((a, b) => new Date(b.fechaDeEmpaque) - new Date(a.fechaDeEmpaque));
                setEmbalajesList(sortedData);
            } else {
                setEmbalajesList([]);
                setError('Los datos recibidos no tienen el formato esperado');
            }
        } catch (err) {
            setError('Error al cargar los embalajes');
            console.error('Error:', err);
            setEmbalajesList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        setSelectedEmbalajeId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este embalaje?')) {
            try {
                setLoading(true);
                await deleteEmbalaje(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar el embalaje');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedEmbalajeId(null);
        await loadData();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedEmbalajeId(null);
    };

    function formatearFecha(fechaStr) {
        if (!fechaStr) return '';
        // Extrae solo la parte de la fecha (YYYY-MM-DD)
        const [anio, mes, dia] = fechaStr.slice(0, 10).split('-');
        return `${dia}/${mes}/${anio}`;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const embalajeFiltrados = embalajesList.filter(embalaje => 
        filtroEmbarque === '' || 
        embalaje.embarque?.numero?.toString().toLowerCase().includes(filtroEmbarque.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Embalajes</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Embalaje
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {!showForm && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Filtrar por número de embarque"
                        value={filtroEmbarque}
                        onChange={(e) => setFiltroEmbarque(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            )}

            {showForm ? (
                <EmbalajeForm
                    embalajeId={selectedEmbalajeId}
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
                                        Estiba
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Número de Cajas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de Empaque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kg Empacados
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Embarque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Presentación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo de Presentación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Remisión
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {embalajeFiltrados.map((embalaje) => (
                                    <tr key={embalaje.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.estiba}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.numeroDeCajas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatearFecha(embalaje.fechaDeEmpaque)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parseFloat(embalaje.kgEmpacado).toFixed(2)} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.embarque?.numero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.presentacion?.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.tipoPresentacion?.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {embalaje.Remision?.numero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(embalaje.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                            
                                                onClick={() => handleDelete(embalaje.id)}
                                                className="text-red-600 hover:text-red-900"
                                                hidden
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

export default Embalajes;