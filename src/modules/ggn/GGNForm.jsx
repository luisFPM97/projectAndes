import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const GGNForm = ({ initialData = {}, onSave, onCancel }) => {
    const [form, setForm] = useState({
        numero: '',
        productorId: '',
        fechaEmision: '',
        fechaVencimiento: '',
        ...initialData
    });
    const [productores, setProductores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductores = async () => {
            try {
                const res = await api.get('/productor');
                setProductores(res.data);
            } catch (err) {
                setError('Error al cargar productores');
            }
        };
        fetchProductores();
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
                <label className="block mb-1">Número GGN</label>
                <input name="numero" value={form.numero} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Productor</label>
                <select
                    name="productorId"
                    value={form.productorId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione un productor</option>
                    {productores.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1">Fecha de Emisión</label>
                <input type="date" name="fechaEmision" value={form.fechaEmision} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Fecha de Vencimiento</label>
                <input type="date" name="fechaVencimiento" value={form.fechaVencimiento} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            </div>
        </form>
    );
};

export default GGNForm; 