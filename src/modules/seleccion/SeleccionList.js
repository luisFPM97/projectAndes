import React, { useState, useEffect } from 'react';
import { getAll, remove } from '../../services/api';
import Seleccion from '../../models/Seleccion';

const SeleccionList = ({ onEdit }) => {
    const [selecciones, setSelecciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSelecciones();
    }, []);

    const loadSelecciones = async () => {
        try {
            setLoading(true);
            const data = await getAll('selecciones');
            setSelecciones(data.map(s => Seleccion.fromJSON(s)));
        } catch (error) {
            console.error('Error cargando selecciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta selección?')) {
            try {
                await remove('selecciones', id);
                loadSelecciones();
            } catch (error) {
                console.error('Error eliminando selección:', error);
            }
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recepción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Selección
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Magullado (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rajado (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Botritis (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {selecciones.map((seleccion) => (
                        <tr key={seleccion.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {seleccion.id_recepcion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(seleccion.fecha_seleccion).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {seleccion.magullado}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {seleccion.rajado}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {seleccion.botritis}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(seleccion.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Editar
                                </button>
                                <button
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
    );
};

export default SeleccionList; 