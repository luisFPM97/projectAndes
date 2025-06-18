import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const GGN = () => {
    const [ggns, setGGNs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedGGNId, setSelectedGGNId] = useState(null);
    const [form, setForm] = useState({ numero: '', productor: '', fechaEmision: '', fechaVencimiento: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState('');

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSort = (key) => {
        const direction = sortConfig.key === key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortConfig({ key, direction });
    };
    const getSortedAndFilteredGGNs = () => {
        let sorted = [...ggns];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        if (searchTerm) {
            sorted = sorted.filter(g =>
                g.numero.includes(searchTerm) ||
                (g.productor && g.productor.includes(searchTerm))
            );
        }
        return sorted;
    };
    const handleSave = (e) => {
        e.preventDefault();
        if (selectedGGNId) {
            setGGNs(ggns.map(g => g.id === selectedGGNId ? { ...form, id: selectedGGNId } : g));
        } else {
            setGGNs([...ggns, { ...form, id: Date.now() }]);
        }
        setShowForm(false);
        setSelectedGGNId(null);
        setForm({ numero: '', productor: '', fechaEmision: '', fechaVencimiento: '' });
    };
    const handleEdit = (id) => {
        const ggn = ggns.find(g => g.id === id);
        setForm({ numero: ggn.numero, productor: ggn.productor, fechaEmision: ggn.fechaEmision, fechaVencimiento: ggn.fechaVencimiento });
        setSelectedGGNId(id);
        setShowForm(true);
    };
    const handleDelete = (id) => {
        setGGNs(ggns.filter(g => g.id !== id));
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex justify-between items-center mb-6">
                    <CardTitle>GGN</CardTitle>
                    <button
                        onClick={() => { setShowForm(true); setForm({ numero: '', productor: '', fechaEmision: '', fechaVencimiento: '' }); setSelectedGGNId(null); }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        + Nuevo GGN
                    </button>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
                    )}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por número o productor..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-w-full">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('numero')}>
                                                Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('productor')}>
                                                Productor {sortConfig.key === 'productor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('fechaEmision')}>
                                                Fecha Emisión {sortConfig.key === 'fechaEmision' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap" onClick={() => handleSort('fechaVencimiento')}>
                                                Fecha Vencimiento {sortConfig.key === 'fechaVencimiento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getSortedAndFilteredGGNs().map(ggn => (
                                            <tr key={ggn.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.numero}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.productor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.fechaEmision}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{ggn.fechaVencimiento}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleEdit(ggn.id)} className="text-blue-500 hover:text-blue-700 mr-4">Editar</button>
                                                    <button onClick={() => handleDelete(ggn.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <form onSubmit={handleSave} className="p-6">
                            <div className="mb-4">
                                <label className="block mb-1">Número GGN</label>
                                <input name="numero" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Productor</label>
                                <input name="productor" value={form.productor} onChange={e => setForm({ ...form, productor: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Fecha de Emisión</label>
                                <input type="date" name="fechaEmision" value={form.fechaEmision} onChange={e => setForm({ ...form, fechaEmision: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Fecha de Vencimiento</label>
                                <input type="date" name="fechaVencimiento" value={form.fechaVencimiento} onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })} className="w-full border rounded px-3 py-2" required />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GGN; 