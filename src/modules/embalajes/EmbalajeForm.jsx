import React, { useState, useEffect } from 'react';
import { getEmbalajeById, createEmbalaje, updateEmbalaje } from '../../services/embalajeService';

const EmbalajeForm = ({ embalajeId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        estiba: '',
        numeroDeCajas: '',
        fechaDeEmpaque: '',
        kgEmpacado: '',
        embarqueId: '',
        presentacionId: '',
        tipoPresentacionId: '',
        remisionId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (embalajeId) {
            loadEmbalaje();
        }
    }, [embalajeId]);

    const loadEmbalaje = async () => {
        try {
            setLoading(true);
            const embalaje = await getEmbalajeById(embalajeId);
            if (embalaje) {
                setFormData({
                    estiba: embalaje.estiba || '',
                    numeroDeCajas: embalaje.numeroDeCajas || '',
                    fechaDeEmpaque: embalaje.fechaDeEmpaque ? new Date(embalaje.fechaDeEmpaque).toISOString().split('T')[0] : '',
                    kgEmpacado: embalaje.kgEmpacado || '',
                    embarqueId: embalaje.embarqueId || '',
                    presentacionId: embalaje.presentacionId || '',
                    tipoPresentacionId: embalaje.tipoPresentacionId || '',
                    remisionId: embalaje.remisionId || ''
                });
            }
        } catch (err) {
            setError('Error al cargar el embalaje');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const dataToSubmit = {
                ...formData,
                estiba: parseInt(formData.estiba),
                numeroDeCajas: parseInt(formData.numeroDeCajas),
                kgEmpacado: parseFloat(formData.kgEmpacado),
                embarqueId: parseInt(formData.embarqueId),
                presentacionId: parseInt(formData.presentacionId),
                tipoPresentacionId: parseInt(formData.tipoPresentacionId),
                remisionId: parseInt(formData.remisionId)
            };

            if (embalajeId) {
                await updateEmbalaje(embalajeId, dataToSubmit);
            } else {
                await createEmbalaje(dataToSubmit);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar el embalaje');
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
                {embalajeId ? 'Editar Embalaje' : 'Nuevo Embalaje'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estiba">
                            Estiba
                        </label>
                        <input
                            type="number"
                            id="estiba"
                            name="estiba"
                            value={formData.estiba}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroDeCajas">
                            Número de Cajas
                        </label>
                        <input
                            type="number"
                            id="numeroDeCajas"
                            name="numeroDeCajas"
                            value={formData.numeroDeCajas}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaDeEmpaque">
                            Fecha de Empaque
                        </label>
                        <input
                            type="date"
                            id="fechaDeEmpaque"
                            name="fechaDeEmpaque"
                            value={formData.fechaDeEmpaque}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kgEmpacado">
                            Kilogramos Empacados
                        </label>
                        <input
                            type="number"
                            id="kgEmpacado"
                            name="kgEmpacado"
                            value={formData.kgEmpacado}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="embarqueId">
                            Embarque
                        </label>
                        <select
                            id="embarqueId"
                            name="embarqueId"
                            value={formData.embarqueId}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione un embarque</option>
                            {/* Aquí deberías cargar los embarques desde la API */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presentacionId">
                            Presentación
                        </label>
                        <select
                            id="presentacionId"
                            name="presentacionId"
                            value={formData.presentacionId}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione una presentación</option>
                            {/* Aquí deberías cargar las presentaciones desde la API */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoPresentacionId">
                            Tipo de Presentación
                        </label>
                        <select
                            id="tipoPresentacionId"
                            name="tipoPresentacionId"
                            value={formData.tipoPresentacionId}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione un tipo</option>
                            {/* Aquí deberías cargar los tipos de presentación desde la API */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remisionId">
                            Remisión
                        </label>
                        <select
                            id="remisionId"
                            name="remisionId"
                            value={formData.remisionId}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione una remisión</option>
                            {/* Aquí deberías cargar las remisiones desde la API */}
                        </select>
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

export default EmbalajeForm; 