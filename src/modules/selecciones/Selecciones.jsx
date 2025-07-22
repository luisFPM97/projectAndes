import React, { useState, useEffect } from 'react';
import SeleccionForm from './SeleccionForm';
import { getAllSelecciones, deleteSeleccion } from '../../services/seleccionService';

const Selecciones = () => {
    const [seleccionesList, setSeleccionesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedSeleccionId, setSelectedSeleccionId] = useState(null);
    const [filtroNumero, setFiltroNumero] = useState('');

    useEffect(() => {
        loadSelecciones();
    }, []);

    const loadSelecciones = async () => {
        try {
            setLoading(true);
            const data = await getAllSelecciones();
            setSeleccionesList(data);
        } catch (err) {
            setError('Error al cargar las selecciones');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        setSelectedSeleccionId(id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta selección?')) {
            try {
                await deleteSeleccion(id);
                loadSelecciones();
            } catch (err) {
                setError('Error al eliminar la selección');
                console.error('Error:', err);
            }
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setSelectedSeleccionId(null);
        loadSelecciones();
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedSeleccionId(null);
    };

    // Filtrar y ordenar selecciones
    const seleccionesFiltradas = seleccionesList
        .filter(sel => {
            const numeroRemision = sel.SeleccionRelaciones[0]?.Remision?.numero?.toString() || '';
            return (
                filtroNumero === '' || numeroRemision.includes(filtroNumero)
            );
        })
        .sort((a, b) => b.id - a.id);

    // Función utilitaria para formatear fechas en formato dd/mm/aaaa sin problemas de zona horaria
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Selecciones</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nueva Selección
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <input
                    type="text"
                    placeholder="Filtrar por número de remisión"
                    value={filtroNumero}
                    onChange={e => setFiltroNumero(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {showForm ? (
                <SeleccionForm
                    seleccionId={selectedSeleccionId}
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
                                        N° Remisión
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Cosecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Recepción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Selección
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        N° Canastas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Neto Canastas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bruto Kg
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Neto Fruta Kg
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Devolución Puerta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registro Aplicación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Magullado (kg)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rajado (kg)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Botritis (kg)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Exportable (kg)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {seleccionesFiltradas.map((seleccion) => (
                                    <tr key={seleccion.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.numero || 'Sin remisión'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatearFecha(seleccion.SeleccionRelaciones[0].Remision.fechaCosecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatearFecha(seleccion.SeleccionRelaciones[0].Remision.fechaRecepcion)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatearFecha(seleccion.fechaSeleccion)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.numeroCanastas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.netoCanastas} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.brutoKg} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.netoFrutaKg} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.devolucionPuerta} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.SeleccionRelaciones[0].Remision.registroAplicacion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.magullado} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.rajado} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.botritis} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {seleccion.exportable} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(seleccion.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                hidden
                                                onClick={() => handleDelete(seleccion.id)}
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

export default Selecciones; 