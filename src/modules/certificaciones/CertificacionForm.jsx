import React, { useState, useEffect } from 'react';
import { certificaciones, fincas } from '../../data/tempData';

const CertificacionForm = ({ certificacionId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        n_cert: '',
        id_finca: '',
        fecha_emision: '',
        fecha_vencimiento: '',
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (certificacionId) {
            loadCertificacion();
        }
    }, [certificacionId]);

    const loadCertificacion = () => {
        const certificacion = certificaciones.find(c => c.id === certificacionId);
        if (certificacion) {
            setFormData({
                n_cert: certificacion.n_cert || '',
                id_finca: certificacion.id_finca || '',
                fecha_emision: certificacion.fecha_emision || '',
                fecha_vencimiento: certificacion.fecha_vencimiento || '',
                activo: certificacion.activo
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (certificacionId) {
                // Actualizar certificación existente
                const index = certificaciones.findIndex(c => c.id === certificacionId);
                if (index !== -1) {
                    certificaciones[index] = { ...certificaciones[index], ...formData };
                }
            } else {
                // Crear nueva certificación
                const newId = Math.max(...certificaciones.map(c => c.id)) + 1;
                const newCertificacion = {
                    id: newId,
                    ...formData
                };
                certificaciones.push(newCertificacion);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar la certificación');
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
                {certificacionId ? 'Editar Certificación' : 'Nueva Certificación'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="n_cert">
                            Número de Certificación
                        </label>
                        <input
                            type="text"
                            id="n_cert"
                            name="n_cert"
                            value={formData.n_cert}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_finca">
                            Finca
                        </label>
                        <select
                            id="id_finca"
                            name="id_finca"
                            value={formData.id_finca}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione una finca</option>
                            {fincas.map(finca => (
                                <option key={finca.id} value={finca.id}>
                                    {finca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_emision">
                            Fecha de Emisión
                        </label>
                        <input
                            type="date"
                            id="fecha_emision"
                            name="fecha_emision"
                            value={formData.fecha_emision}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_vencimiento">
                            Fecha de Vencimiento
                        </label>
                        <input
                            type="date"
                            id="fecha_vencimiento"
                            name="fecha_vencimiento"
                            value={formData.fecha_vencimiento}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-700 text-sm font-bold">Activa</span>
                        </label>
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

export default CertificacionForm; 