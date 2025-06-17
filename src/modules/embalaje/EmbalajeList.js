import React, { useState, useEffect } from 'react';
import { getAll, remove } from '../../services/api';
import Embalaje from '../../models/Embalaje';

const EmbalajeList = ({ onEdit }) => {
    const [embalajes, setEmbalajes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmbalajes();
    }, []);

    const loadEmbalajes = async () => {
        try {
            setLoading(true);
            const data = await getAll('embalajes');
            setEmbalajes(data.map(e => Embalaje.fromJSON(e)));
        } catch (error) {
            console.error('Error cargando embalajes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este embalaje?')) {
            try {
                await remove('embalajes', id);
                loadEmbalajes();
            } catch (error) {
                console.error('Error eliminando embalaje:', error);
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
                            Estiba
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recepción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Presentación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            N° Cajas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kg Empacado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % Empacado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {embalajes.map((embalaje) => (
                        <tr key={embalaje.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.estiba}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.id_recepcion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.id_presentacion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.numero_cajas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.kg_empacado}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {embalaje.porcentaje_empacado}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(embalaje.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(embalaje.id)}
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

export default EmbalajeList; 