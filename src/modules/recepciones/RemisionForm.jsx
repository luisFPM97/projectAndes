import React, { useState, useEffect } from 'react';
import { getRemisionById, createRemision, updateRemision } from '../../services/remisionService';

const RemisionForm = ({remisionEnv, fincaId, remisionId, productores, fincas, lotes, certificaciones, tiposFruta, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        fechaCosecha: '',
        fechaRecepcion: '',
        brutoKg: '',
        netoFrutaKg: '',
        numeroCanastas: '',
        netoCanastas: '',
        registroAplicacion: '',
        devolucionPuerta: '',
        productorId: '',
        fincaId: fincaId,
        loteId: '',
        certicaId: '',
        tipofrutaId: '',
        trazabilidad: ''
    });
    const [remision, setRemision] = useState()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fincasFiltradas, setFincasFiltradas] = useState([]);
    const [lotesFiltrados, setLotesFiltrados] = useState([]);
    const [certificacionesFiltradas, setCertificacionesFiltradas] = useState([]);


    useEffect(() => {
        if (remisionId) {
            loadRemision();
            console.log('la remision enviada es:',remisionEnv)
            console.log(fincas)
            console.log(lotes)
            console.log(formData)
            console.log(fincaId)
        }
    }, [remisionId]);

    useEffect(() => {
        if (formData.productorId) {
            const fincasDelProductor = fincas.filter(f => f.productorId === parseInt(formData.productorId));
            setFincasFiltradas(fincasDelProductor);
            //setFormData(prev => ({ ...prev, fincaId: '' }));
        } else {
            setFincasFiltradas([]);
        }
    }, [formData.productorId, fincas]);

    useEffect(() => {
        if (fincaId) {
            const lotesDeLaFinca = lotes.filter(l => l.fincaId === parseInt(formData.fincaId));
            setLotesFiltrados(lotesDeLaFinca);
            //setFormData(prev => ({ ...prev, loteId: '' }));
        } else {
            setLotesFiltrados([]);
        }
    }, [formData.fincaId, lotes]);

    useEffect(() => {
        if (formData.fincaId) {
            const certificacionesDeLaFinca = certificaciones.filter(c => c.fincaId === parseInt(formData.fincaId));
            setCertificacionesFiltradas(certificacionesDeLaFinca);
            //setFormData(prev => ({ ...prev, certicaId: '' }));
        } else {
            setCertificacionesFiltradas([]);
        }
    }, [formData.fincaId, certificaciones]);


    const formatDateForInput = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

    const loadRemision = async () => {

        try {
            setLoading(true);
            
            setFormData({
                numero: remisionEnv.numero,
                fechaCosecha: formatDateForInput(remisionEnv.fechaCosecha),
                fechaRecepcion: formatDateForInput(remisionEnv.fechaRecepcion),
                brutoKg: remisionEnv.brutoKg,
                netoFrutaKg: remisionEnv.netoFrutaKg,
                numeroCanastas: remisionEnv.numeroCanastas,
                netoCanastas: remisionEnv.netoCanastas,
                registroAplicacion: remisionEnv.registroAplicacion,
                devolucionPuerta: remisionEnv.devolucionPuerta,
                productorId: remisionEnv.RemisionRelaciones[0]?.productorId,
                fincaId: fincaId,
                loteId: remisionEnv.RemisionRelaciones[0]?.loteId,
                certicaId: remisionEnv.RemisionRelaciones[0]?.certicaId,
                tipofrutaId: remisionEnv.RemisionRelaciones[0]?.tipofrutaId,
                trazabilidad: remisionEnv.RemisionRelaciones[0]?.Trazabilidad.numero
            })
            
            
        } catch (err) {
            setError('Error al cargar la remisión');
            console.error('Error:', err);
        } finally {
            console.log(formData)
            setLoading(false);
        }
    };

    const calcularDiaDelAnio = (fecha) => {
        const date = new Date(fecha);
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear.toString().padStart(3, '0');
    };

    const calcularTrazabilidad = (productorId, fincaId, loteId, fechaCosecha) => {
        if (!productorId || !fincaId || !loteId || !fechaCosecha) return '';

        const productor = productores.find(p => p.id === parseInt(productorId));
        const finca = fincas.find(f => f.id === parseInt(fincaId));
        const lote = lotes.find(l => l.id === parseInt(loteId));

        if (!productor || !finca || !lote) return '';

        const diaDelAnio = calcularDiaDelAnio(fechaCosecha);
        return `${productor.codigo}${finca.codigo}${lote.numero}${diaDelAnio}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const newFormData = {
            ...formData,
            [name]: value
        };

        // Si se modifican los campos que afectan la trazabilidad, recalcular
        if (['productorId', 'fincaId', 'loteId', 'fechaCosecha'].includes(name)) {
            newFormData.trazabilidad = calcularTrazabilidad(
                name === 'productorId' ? value : formData.productorId,
                name === 'fincaId' ? value : formData.fincaId,
                name === 'loteId' ? value : formData.loteId,
                name === 'fechaCosecha' ? value : formData.fechaCosecha
            );
        }

        setFormData(newFormData);

        if (name === 'productorId') {
            const fincasDelProductor = fincas.filter(f => f.productorId === parseInt(value));
            setFincasFiltradas(fincasDelProductor);
        } else if (name === 'fincaId') {
            const lotesDeLaFinca = lotes.filter(l => l.fincaId === parseInt(value));
            setLotesFiltrados(lotesDeLaFinca);
            console.log(lotesFiltrados)
            //setFormData(prev => ({ ...prev, loteId: '' }));

            const certificacionesDeLaFinca = certificaciones.filter(c => c.fincaId === parseInt(value));
            setCertificacionesFiltradas(certificacionesDeLaFinca);
            //setFormData(prev => ({ ...prev, certicaId: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (remisionId) {
                await updateRemision(remisionId, formData);
                console.log(formData)
            } else {
                console.log(formData)
                await createRemision(formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la remisión');
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {remisionId ? 'Editar Remisión' : 'Nueva Remisión'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Remisión
                        </label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Productor
                        </label>
                        <select
                            name="productorId"
                            value={formData.productorId}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Finca
                        </label>
                        <select
                            name="fincaId"
                            value={formData.fincaId}
                            onChange={handleChange}
                            required
                            disabled={!formData.productorId || !!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Seleccione una finca</option>
                            {fincasFiltradas.map(finca => (
                                <option key={finca.id} value={finca.id}>
                                    {finca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lote
                        </label>
                        <select
                            name="loteId"
                            value={formData.loteId}
                            onChange={handleChange}
                            required
                            disabled={!formData.fincaId || !!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Seleccione un lote</option>
                            {lotesFiltrados.map(lote => (
                                <option key={lote.id} value={lote.id}>
                                    Lote {lote.numero}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certificación
                        </label>
                        <select
                            name="certicaId"
                            value={formData.certicaId}
                            onChange={handleChange}
                            required
                            disabled={!formData.fincaId || !!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Seleccione una certificación</option>
                            {certificacionesFiltradas.map(certica => (
                                <option key={certica.id} value={certica.id}>
                                    Cert. {certica.numero}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Fruta
                        </label>
                        <select
                            name="tipofrutaId"
                            value={formData.tipofrutaId}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Seleccione un tipo de fruta</option>
                            {tiposFruta.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Cosecha
                        </label>
                        <input
                            type="date"
                            name="fechaCosecha"
                            value={formData.fechaCosecha}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Recepción
                        </label>
                        <input
                            type="date"
                            name="fechaRecepcion"
                            value={formData.fechaRecepcion}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Canastas
                        </label>
                        <input
                            type="number"
                            name="numeroCanastas"
                            value={formData.numeroCanastas}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso Neto Canastas (Kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="netoCanastas"
                            value={formData.netoCanastas}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso Bruto (Kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="brutoKg"
                            value={formData.brutoKg}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso Neto Fruta (Kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="netoFrutaKg"
                            value={formData.netoFrutaKg}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Devolución Puerta (Kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="devolucionPuerta"
                            value={formData.devolucionPuerta}
                            onChange={handleChange}
                            required
                            disabled={!!remisionId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registro de Aplicación
                        </label>
                        <input
                            type="text"
                            name="registroAplicacion"
                            value={formData.registroAplicacion}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Trazabilidad
                        </label>
                        <input
                            type="text"
                            name="trazabilidad"
                            value={formData.trazabilidad}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RemisionForm; 