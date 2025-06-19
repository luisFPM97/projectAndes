import React, { useState, useEffect } from 'react';
import { getAllRemisiones } from '../../services/remisionService';
import { createSeleccion, getSeleccionById, updateSeleccion } from '../../services/seleccionService';

const SeleccionForm = ({ seleccionId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        remisionId: '',
        fechaSeleccion: '',
        magullado: '',
        rajado: '',
        botritis: '',
        exportable: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recepcionSeleccionada, setRecepcionSeleccionada] = useState(null);
    const [remisiones, setRemisiones] = useState([]);

    useEffect(() => {
        loadRemisiones();
    }, []);

    useEffect(() => {
        if (seleccionId && remisiones.length > 0) {
            loadSeleccion();
        }
    }, [seleccionId, remisiones]);

    const loadRemisiones = async () => {
        try {
            setLoading(true);
            const data = await getAllRemisiones();
            setRemisiones(data);
        } catch (error) {
            setError('Error al cargar las remisiones');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSeleccion = async () => {
        try {
            setLoading(true);
            const seleccion = await getSeleccionById(seleccionId);
            if (seleccion) {
                const remisionId = seleccion.SeleccionRelaciones?.[0]?.Remision?.id || '';
                setFormData({
                    remisionId: remisionId.toString(),
                    fechaSeleccion: seleccion.fechaSeleccion ? seleccion.fechaSeleccion.slice(0, 10) : '',
                    magullado: seleccion.magullado,
                    rajado: seleccion.rajado,
                    botritis: seleccion.botritis,
                    exportable: seleccion.exportable
                });
                console.log('FormData cargado al editar:', {
                    remisionId: remisionId.toString(),
                    fechaSeleccion: seleccion.fechaSeleccion,
                    magullado: seleccion.magullado,
                    rajado: seleccion.rajado,
                    botritis: seleccion.botritis,
                    exportable: seleccion.exportable
                });
                setRecepcionSeleccionada(seleccion.SeleccionRelaciones?.[0]?.Remision);
                if (remisionId) {
                    loadRecepcion(remisionId);
                }
            }
        } catch (error) {
            setError('Error al cargar la selección');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecepcion = (remisionId) => {
        const remision = remisiones.find(r => r.id === remisionId);
        if (remision) {
            setRecepcionSeleccionada(remision);
            // Calcular exportable cuando se carga una nueva recepción
            const exportable = calcularExportable(
                formData.magullado,
                formData.rajado,
                formData.botritis
            );
            setFormData(prev => ({
                ...prev,
                exportable
            }));
        }
    };

    const calcularExportable = (magullado, rajado, botritis) => {
        if (!recepcionSeleccionada) return 0;
        const pesoNeto = recepcionSeleccionada.netoFrutaKg || 0;
        const totalDesperdicio = (parseFloat(magullado) || 0) + (parseFloat(rajado) || 0) + (parseFloat(botritis) || 0);
        return Math.max(0, pesoNeto - totalDesperdicio);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'remisionId') {
            const remisionId = parseInt(value);
            setFormData(prev => ({
                ...prev,
                [name]: remisionId
            }));
            loadRecepcion(remisionId);
        } else {
            const newFormData = {
                ...formData,
                [name]: value
            };

            // Calcular exportable cuando cambian los valores de desperdicio
            if (['magullado', 'rajado', 'botritis'].includes(name)) {
                newFormData.exportable = calcularExportable(
                    name === 'magullado' ? value : formData.magullado,
                    name === 'rajado' ? value : formData.rajado,
                    name === 'botritis' ? value : formData.botritis
                );
            }
            setFormData(newFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Recalcular exportable antes de guardar
            const recalculatedExportable = calcularExportable(
                formData.magullado,
                formData.rajado,
                formData.botritis
            );
            const dataToSave = {
                ...formData,
                exportable: recalculatedExportable
            };
            if (seleccionId) {
                await updateSeleccion(seleccionId, dataToSave);
            } else {
                await createSeleccion(dataToSave);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Error al guardar la selección');
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
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {seleccionId ? 'Editar Selección' : 'Nueva Selección'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remisionId">
                            Remisión
                        </label>
                        <select
                            id="remisionId"
                            name="remisionId"
                            value={formData.remisionId || ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione una remisión</option>
                            {remisiones.map(remision => (
                                <option key={remision.id} value={remision.id}>
                                    {`Remisión #${remision.numero}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaSeleccion">
                            Fecha de Selección
                        </label>
                        <input
                            type="date"
                            id="fechaSeleccion"
                            name="fechaSeleccion"
                            value={formData.fechaSeleccion}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {recepcionSeleccionada && (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Información de la Remisión</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">N° Remisión:</p>
                                    <p className="font-medium">{recepcionSeleccionada.numero}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fecha Cosecha:</p>
                                    <p className="font-medium">{new Date(recepcionSeleccionada.fechaCosecha).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fecha Recepción:</p>
                                    <p className="font-medium">{new Date(recepcionSeleccionada.fechaRecepcion).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">N° Canastas:</p>
                                    <p className="font-medium">{recepcionSeleccionada.numeroCanastas}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Neto Canastas:</p>
                                    <p className="font-medium">{recepcionSeleccionada.netoCanastas} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Bruto Kg:</p>
                                    <p className="font-medium">{recepcionSeleccionada.brutoKg} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Neto Fruta Kg:</p>
                                    <p className="font-medium">{recepcionSeleccionada.netoFrutaKg} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Devolución Puerta:</p>
                                    <p className="font-medium">{recepcionSeleccionada.devolucionPuerta} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Registro Aplicación:</p>
                                    <p className="font-medium">{recepcionSeleccionada.registroAplicacion}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="magullado">
                            Magullado (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="magullado"
                            name="magullado"
                            value={formData.magullado}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rajado">
                            Rajado (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="rajado"
                            name="rajado"
                            value={formData.rajado}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="botritis">
                            Botritis (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="botritis"
                            name="botritis"
                            value={formData.botritis}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exportable">
                            Exportable (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="exportable"
                            name="exportable"
                            value={formData.exportable}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SeleccionForm; 