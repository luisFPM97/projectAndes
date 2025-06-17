import React, { useState, useEffect } from 'react';
import { getAllRemisiones, deleteRemision } from '../../services/remisionService';
import { getAll } from '../../services/productorService';
import { getAllFincas } from '../../services/fincaService';
import { getAllLotes } from '../../services/loteService';
import { getAllCerticas } from '../../services/certicaService';
import { getAllTipofrutas } from '../../services/tipofrutaService';
import RemisionForm from './RemisionForm';

const Recepciones = () => {
    const [remisiones, setRemisiones] = useState([]);
    const [productores, setProductores] = useState([]);
    const [fincas, setFincas] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [certificaciones, setCertificaciones] = useState([]);
    const [tiposFruta, setTiposFruta] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedRemisionId, setSelectedRemisionId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [remisionEnviada, setRemisionEnviada] = useState(null)
    const [sortConfig, setSortConfig] = useState({
        key: 'numero',
        direction: 'asc'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [
                remisionesData,
                productoresData,
                fincasData,
                lotesData,
                certificacionesData,
                tiposFrutaData
            ] = await Promise.all([
                getAllRemisiones(),
                getAll(),
                getAllFincas(),
                getAllLotes(),
                getAllCerticas(),
                getAllTipofrutas()
            ]);
            setRemisiones(remisionesData);
            console.log(remisionesData)
            setProductores(productoresData);
            setFincas(fincasData);
            setLotes(lotesData);
            setCertificaciones(certificacionesData);
            setTiposFruta(tiposFrutaData);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError(err.message || 'Error al cargar los datos. Por favor, intente nuevamente.');
            setRemisiones([]);
            setProductores([]);
            setFincas([]);
            setLotes([]);
            setCertificaciones([]);
            setTiposFruta([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta remisión?')) {
            try {
                setLoading(true);
                await deleteRemision(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar la remisión');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedRemisionId(null);
        await loadData();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const getSortedAndFilteredRemisiones = () => {
        let filteredRemisiones = remisiones;

        // Aplicar filtro de búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredRemisiones = remisiones.filter(remision => 
                remision.numero.toLowerCase().includes(searchLower) ||
                remision.Productor?.nombre.toLowerCase().includes(searchLower) ||
                remision.Finca?.nombre.toLowerCase().includes(searchLower) ||
                remision.Lote?.numero.toString().includes(searchLower) ||
                remision.Certica?.numero.toLowerCase().includes(searchLower) ||
                remision.Tipofruta?.nombre.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar ordenamiento
        return [...filteredRemisiones].sort((a, b) => {
            if (sortConfig.key === 'numero') {
                // Convertir los números de remisión a enteros para ordenar correctamente
                const numA = parseInt(a.numero);
                const numB = parseInt(b.numero);
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            } else if (sortConfig.key === 'fechaRecepcion') {
                return sortConfig.direction === 'asc' 
                    ? new Date(a.fechaRecepcion) - new Date(b.fechaRecepcion)
                    : new Date(b.fechaRecepcion) - new Date(a.fechaRecepcion);
            }
            return 0;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Remisiones</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Nueva Remisión
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por número, productor, finca, lote, certificación o tipo de fruta..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-scroll">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('numero')}
                            >
                                Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Finca
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lote
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Certificación
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo de Fruta
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('fechaRecepcion')}
                            >
                                Fecha Recepción {sortConfig.key === 'fechaRecepcion' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Cosecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                N° Canastas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Neto Canastas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bruto (Kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Neto (Kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Devolución Puerta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Registro Aplicación
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                N° Trazabilidad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getSortedAndFilteredRemisiones().map(remision => (
                            <tr key={remision.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.numero}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.RemisionRelaciones[0]?.productor.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.RemisionRelaciones[0]?.finca.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    Lote {remision.RemisionRelaciones[0]?.lote.numero}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    Cert. {remision.RemisionRelaciones[0]?.Certica.numero}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.RemisionRelaciones[0]?.Tipofrutum.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(remision.fechaRecepcion).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(remision.fechaCosecha).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.numeroCanastas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.netoCanastas} kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.brutoKg} kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.netoFrutaKg} kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.devolucionPuerta} kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.registroAplicacion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {remision.RemisionRelaciones[0]?.Trazabilidad?.numero || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                    
                                        onClick={() => {
                                            setSelectedRemisionId(remision.id);
                                            setShowForm(true);
                                            setRemisionEnviada(remision)
                                        }}
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                    hidden
                                        onClick={() => handleDelete(remision.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
                        <RemisionForm
                            fincaId ={remisionEnviada?.RemisionRelaciones?.[0]?.fincaId ?? 0}
                            remisionEnv ={remisionEnviada}
                            remisionId={selectedRemisionId}
                            productores={productores}
                            fincas={fincas}
                            lotes={lotes}
                            certificaciones={certificaciones}
                            tiposFruta={tiposFruta}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setSelectedRemisionId(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recepciones; 