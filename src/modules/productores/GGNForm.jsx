import React, { useState, useEffect } from 'react';
import { createGGN, updateGGN, getByIdGGN } from '../../services/ggnService';

const GGNForm = ({ ggnId, productorId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        fechaEmision: '',
        fechaVencimiento: '',
        productorId: productorId || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ggnId) {
            loadGGN();
        }
    }, [ggnId]);

    const loadGGN = async () => {
        try {
            setLoading(true);
            const ggn = await getByIdGGN(ggnId);
            setFormData({
                numero: ggn.numero || '',
                fechaEmision: ggn.fechaEmision ? ggn.fechaEmision.slice(0, 10) : '',
                fechaVencimiento: ggn.fechaVencimiento ? ggn.fechaVencimiento.slice(0, 10) : '',
                productorId: ggn.productorId || productorId || '',
            });
        } catch (err) {
            setError('Error al cargar el GGN');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (ggnId) {
                await updateGGN(ggnId, formData);
            } else {
                await createGGN({ ...formData, productorId });
            }
            onSave();
        } catch (err) {
            setError('Error al guardar el GGN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{ggnId ? 'Editar GGN' : 'Nuevo GGN'}</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Número GGN</label>
                    <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Emisión</label>
                    <input
                        type="date"
                        name="fechaEmision"
                        value={formData.fechaEmision}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
                    <input
                        type="date"
                        name="fechaVencimiento"
                        value={formData.fechaVencimiento}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    );
};

export default GGNForm; 