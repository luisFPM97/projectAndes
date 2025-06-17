import React, { useState, useEffect } from 'react';
import { getAll, remove } from '../../services/api';
import Recepcion from '../../models/Recepcion';

const RecepcionList = ({ onEdit }) => {
    const [recepciones, setRecepciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecepciones();
    }, []);

    const loadRecepciones = async () => {
        try {
            setLoading(true);
            const data = await getAll('recepciones');
            setRecepciones(data.map(r => Recepcion.fromJSON(r)));
        } catch (error) {
            console.error('Error cargando recepciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta recepción?')) {
            try {
                await remove('recepciones', id);
                loadRecepciones();
            } catch (error) {
                console.error('Error eliminando recepción:', error);
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
                            N° Entrada
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Cosecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Recepción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo Fruta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fruta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kg Neto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {recepciones.map((recepcion) => (
                        <tr key={recepcion.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {recepcion.n_entrada}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(recepcion.fecha_cosecha).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(recepcion.fecha_recepcion).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {recepcion.tipo_fruta}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {recepcion.fruta}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {recepcion.neto_fruta}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(recepcion.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(recepcion.id)}
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

export default RecepcionList; 