import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const FacturaForm = ({ factura, onSave, onCancel }) => {
    const safeFactura = factura || {};
    const [form, setForm] = useState({
        numero: safeFactura.numero || '',
        descripcion: safeFactura.descripcion || '',
        embarqueId: safeFactura.embarqueId || '',
    });
    const [embarques, setEmbarques] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmbarques = async () => {
            try {
                const res = await api.get('/embarques');
                setEmbarques(res.data);
            } catch (err) {
                setError('Error al cargar embarques');
            }
        };
        fetchEmbarques();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <div className="mb-4">
                <label className="block mb-1">Número de Factura</label>
                <input name="numero" value={form.numero} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Descripción</label>
                <input name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Embarque</label>
                <select
                    name="embarqueId"
                    value={form.embarqueId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione un embarque</option>
                    {embarques.map(emb => (
                        <option key={emb.id} value={emb.id}>{emb.numero}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            </div>
        </form>
    );
};

export default FacturaForm; 