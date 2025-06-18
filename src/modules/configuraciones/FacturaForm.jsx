import React from 'react';

const FacturaForm = ({ facturaId, onSave, onCancel }) => {
    // Aquí puedes agregar lógica para cargar datos si facturaId está presente
    const [form, setForm] = React.useState({
        numero: '',
        descripcion: '',
        embarque: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
                <label className="block mb-1">Número de Factura</label>
                <input name="numero" value={form.numero} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Embarque</label>
                <input name="embarque" value={form.embarque} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            </div>
        </form>
    );
};

export default FacturaForm; 