import React, { useState, useEffect } from 'react';
import { recepciones, productores, fincas, lotes, tipos_fruta, frutas, certificaciones } from '../../data/tempData';

const RecepcionForm = ({ recepcionId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        n_entrada: '',
        fecha_cosecha: '',
        fecha_recepcion: '',
        id_productor: '',
        id_finca: '',
        id_lote: '',
        id_tipo_fruta: '',
        id_fruta: '',
        kg_bruto: '',
        neto_canastas: '',
        numero_canastas: '',
        registro_ica: '',
        registro_aplicacion: '',
        peso_neto_fruta: '',
        trazabilidad: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lotesDisponibles, setLotesDisponibles] = useState([]);
    const [fincasDisponibles, setFincasDisponibles] = useState([]);

    useEffect(() => {
        if (recepcionId) {
            loadRecepcion();
        }
    }, [recepcionId]);

    useEffect(() => {
        if (formData.id_productor) {
            loadFincasDisponibles(formData.id_productor);
        } else {
            setFincasDisponibles([]);
            setFormData(prev => ({
                ...prev,
                id_finca: '',
                id_lote: '',
                registro_ica: ''
            }));
        }
    }, [formData.id_productor]);

    useEffect(() => {
        if (formData.id_finca) {
            loadLotesDisponibles(formData.id_finca);
            loadCertificadoICA(formData.id_finca);
        } else {
            setLotesDisponibles([]);
            setFormData(prev => ({
                ...prev,
                id_lote: '',
                registro_ica: ''
            }));
        }
    }, [formData.id_finca]);

    useEffect(() => {
        if (formData.id_productor && formData.id_finca && formData.id_lote && formData.fecha_cosecha) {
            generarTrazabilidad();
        }
    }, [formData.id_productor, formData.id_finca, formData.id_lote, formData.fecha_cosecha]);

    useEffect(() => {
        calcularPesoNetoFruta();
    }, [formData.kg_bruto, formData.neto_canastas]);

    const calcularPesoNetoFruta = () => {
        const kgBruto = parseFloat(formData.kg_bruto) || 0;
        const netoCanastas = parseFloat(formData.neto_canastas) || 0;
        const pesoNetoFruta = kgBruto - netoCanastas;
        
        setFormData(prev => ({
            ...prev,
            peso_neto_fruta: pesoNetoFruta.toFixed(2)
        }));
    };

    const loadCertificadoICA = (fincaId) => {
        const certificado = certificaciones.find(c => c.id_finca === parseInt(fincaId) && c.activo);
        if (certificado) {
            setFormData(prev => ({
                ...prev,
                registro_ica: certificado.n_cert
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                registro_ica: 'Sin certificado activo'
            }));
        }
    };

    const generarTrazabilidad = () => {
        const productor = productores.find(p => p.id === parseInt(formData.id_productor));
        const finca = fincas.find(f => f.id === parseInt(formData.id_finca));
        const lote = lotes.find(l => l.id === parseInt(formData.id_lote));

        if (productor && finca && lote && formData.fecha_cosecha) {
            // Obtener el día del año (1-365)
            const fecha = new Date(formData.fecha_cosecha);
            const inicioAño = new Date(fecha.getFullYear(), 0, 0);
            const diff = fecha - inicioAño;
            const diaDelAño = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            // Formatear el día del año a 3 dígitos
            const diaFormateado = diaDelAño.toString().padStart(3, '0');
            
            // Generar la trazabilidad
            const trazabilidad = `${productor.codigo.slice(0, 4)}${finca.codigo.slice(0, 3)}${lote.codigo.slice(0, 2)}${diaFormateado}`;
            
            setFormData(prev => ({
                ...prev,
                trazabilidad
            }));
        }
    };

    const loadRecepcion = () => {
        const recepcion = recepciones.find(r => r.id === recepcionId);
        if (recepcion) {
            setFormData({
                n_entrada: recepcion.n_entrada || '',
                fecha_cosecha: recepcion.fecha_cosecha || '',
                fecha_recepcion: recepcion.fecha_recepcion || '',
                id_productor: recepcion.id_productor || '',
                id_finca: recepcion.id_finca || '',
                id_lote: recepcion.id_lote || '',
                id_tipo_fruta: recepcion.id_tipo_fruta || '',
                id_fruta: recepcion.id_fruta || '',
                kg_bruto: recepcion.kg_bruto || '',
                neto_canastas: recepcion.neto_canastas || '',
                numero_canastas: recepcion.numero_canastas || '',
                registro_ica: recepcion.registro_ica || '',
                registro_aplicacion: recepcion.registro_aplicacion || '',
                peso_neto_fruta: recepcion.peso_neto_fruta || '',
                trazabilidad: recepcion.trazabilidad || ''
            });
        }
    };

    const loadLotesDisponibles = (fincaId) => {
        const lotesFinca = lotes.filter(l => l.id_finca === parseInt(fincaId));
        setLotesDisponibles(lotesFinca);
    };

    const loadFincasDisponibles = (productorId) => {
        const productor = productores.find(p => p.id === parseInt(productorId));
        if (productor && productor.id_finca) {
            const fincaProductor = fincas.find(f => f.id === productor.id_finca);
            setFincasDisponibles(fincaProductor ? [fincaProductor] : []);
        } else {
            setFincasDisponibles([]);
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
            if (recepcionId) {
                // Actualizar recepción existente
                const index = recepciones.findIndex(r => r.id === recepcionId);
                if (index !== -1) {
                    recepciones[index] = { ...recepciones[index], ...formData };
                }
            } else {
                // Crear nueva recepción
                const newId = Math.max(...recepciones.map(r => r.id)) + 1;
                const newRecepcion = {
                    id: newId,
                    ...formData
                };
                recepciones.push(newRecepcion);
            }
            onSave();
        } catch (err) {
            setError('Error al guardar la recepción');
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
                {recepcionId ? 'Editar Recepción' : 'Nueva Recepción'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trazabilidad">
                            Trazabilidad
                        </label>
                        <input
                            type="text"
                            id="trazabilidad"
                            name="trazabilidad"
                            value={formData.trazabilidad}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formato: 4 dígitos productor + 3 dígitos finca + 2 dígitos lote + 3 dígitos día del año
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="n_entrada">
                            Número de Entrada
                        </label>
                        <input
                            type="text"
                            id="n_entrada"
                            name="n_entrada"
                            value={formData.n_entrada}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_cosecha">
                            Fecha de Cosecha
                        </label>
                        <input
                            type="date"
                            id="fecha_cosecha"
                            name="fecha_cosecha"
                            value={formData.fecha_cosecha}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_recepcion">
                            Fecha de Recepción
                        </label>
                        <input
                            type="date"
                            id="fecha_recepcion"
                            name="fecha_recepcion"
                            value={formData.fecha_recepcion}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_productor">
                            Productor
                        </label>
                        <select
                            id="id_productor"
                            name="id_productor"
                            value={formData.id_productor}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione un productor</option>
                            {productores.map(productor => (
                                <option key={productor.id} value={productor.id}>
                                    {productor.nombre}
                                </option>
                            ))}
                        </select>
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
                            disabled={!formData.id_productor}
                        >
                            <option value="">Seleccione una finca</option>
                            {fincasDisponibles.map(finca => (
                                <option key={finca.id} value={finca.id}>
                                    {finca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_lote">
                            Lote
                        </label>
                        <select
                            id="id_lote"
                            name="id_lote"
                            value={formData.id_lote}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione un lote</option>
                            {lotesDisponibles.map(lote => (
                                <option key={lote.id} value={lote.id}>
                                    {lote.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_tipo_fruta">
                            Tipo de Fruta
                        </label>
                        <select
                            id="id_tipo_fruta"
                            name="id_tipo_fruta"
                            value={formData.id_tipo_fruta}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione un tipo de fruta</option>
                            {tipos_fruta.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_fruta">
                            Fruta
                        </label>
                        <select
                            id="id_fruta"
                            name="id_fruta"
                            value={formData.id_fruta}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccione una fruta</option>
                            {frutas.map(fruta => (
                                <option key={fruta.id} value={fruta.id}>
                                    {fruta.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kg_bruto">
                            Kilogramos Brutos (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="kg_bruto"
                            name="kg_bruto"
                            value={formData.kg_bruto}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="neto_canastas">
                            Peso Neto Canastas (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="neto_canastas"
                            name="neto_canastas"
                            value={formData.neto_canastas}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero_canastas">
                            Número de Canastas
                        </label>
                        <input
                            type="number"
                            id="numero_canastas"
                            name="numero_canastas"
                            value={formData.numero_canastas}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registro_ica">
                            Registro ICA
                        </label>
                        <input
                            type="text"
                            id="registro_ica"
                            name="registro_ica"
                            value={formData.registro_ica}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registro_aplicacion">
                            Registro de Aplicación
                        </label>
                        <input
                            type="text"
                            id="registro_aplicacion"
                            name="registro_aplicacion"
                            value={formData.registro_aplicacion}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="peso_neto_fruta">
                            Peso Neto Fruta (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="peso_neto_fruta"
                            name="peso_neto_fruta"
                            value={formData.peso_neto_fruta}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                            disabled
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

export default RecepcionForm; 