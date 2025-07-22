import React, { useState, useEffect } from 'react';
import { getAllRemisiones } from '../../services/remisionService';
import { exportarBalance } from './ExportarBalanceExcel';
import { exportarBalanceExceljs } from './ExportarBalanceExcelExceljs';

const BalanceDeMasas = () => {
    const [remisiones, setRemisiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProductor, setSelectedProductor] = useState('');
    const [selectedEmbarque, setSelectedEmbarque] = useState('');
    const [selectedPresentacion, setSelectedPresentacion] = useState('');

    // Obtener lista de productores únicos (con o sin GGN)
    const productoresUnicos = React.useMemo(() => {
        const productores = {};
        remisiones.forEach(row => {
            const productor = row.RemisionRelaciones?.[0]?.productor;
            if (productor) {
                const ggn = productor?.GGNs?.[0]?.numero;
                productores[productor.nombre] = {
                    nombre: productor.nombre,
                    ggn: ggn || null
                };
            }
        });
        return Object.values(productores);
    }, [remisiones]);

    // Obtener lista de embarques únicos
    const embarquesUnicos = React.useMemo(() => {
        const embarques = {};
        remisiones.forEach(row => {
            const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
            embalajes.forEach(emb => {
                if (emb.embarque && emb.embarque.numero) {
                    embarques[emb.embarque.numero] = {
                        numero: emb.embarque.numero,
                        // Puedes agregar más campos si quieres mostrar más info
                    };
                }
            });
        });
        return Object.values(embarques);
    }, [remisiones]);

    // Obtener lista de presentaciones únicas
    const presentacionesUnicas = React.useMemo(() => {
        const presentaciones = {};
        remisiones.forEach(row => {
            const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
            embalajes.forEach(emb => {
                if (emb.presentacion && emb.presentacion.nombre) {
                    presentaciones[emb.presentacion.nombre] = {
                        nombre: emb.presentacion.nombre
                    };
                }
            });
        });
        return Object.values(presentaciones);
    }, [remisiones]);

    // Filtrar remisiones por nombre de productor y embarque seleccionado
    const remisionesFiltradas = React.useMemo(() => {
        let filtradas = remisiones;
        if (selectedProductor) {
            filtradas = filtradas.filter(row => {
                const productor = row.RemisionRelaciones?.[0]?.productor;
                return productor && productor.nombre === selectedProductor;
            });
        }
        if (selectedEmbarque) {
            filtradas = filtradas.filter(row => {
                const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
                return embalajes.some(emb => emb.embarque && emb.embarque.numero === selectedEmbarque);
            });
        }
        if (selectedPresentacion) {
            filtradas = filtradas.filter(row => {
                const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
                return embalajes.some(emb => emb.presentacion && emb.presentacion.nombre === selectedPresentacion);
            });
        }
        return filtradas;
    }, [remisiones, selectedProductor, selectedEmbarque, selectedPresentacion]);

    // Calcular totales
    const totales = React.useMemo(() => {
        let totalCajasExportar = 0;
        let totalCajas12x100 = 0;
        let totalKg12x100 = 0;
        let totalCajasGranel = 0;
        let totalKgGranel = 0;
        let totalCajasGulupa = 0;
        let totalKgGulupa = 0;
        let totalCajas = 0;
        let totalKg = 0;
        let totalKgBruto = 0;
        let totalKgNeto = 0;
        let totalKgMagullada = 0;
        let totalKgRajado = 0;
        let totalKgBotritis = 0;
        let totalKgExportable = 0;
        remisionesFiltradas.forEach(row => {
            const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
            totalKgBruto += parseFloat(row.brutoKg) || 0;
            totalKgNeto += parseFloat(row.netoFrutaKg) || 0;
            totalKgMagullada += parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0;
            totalKgRajado += parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0;
            totalKgBotritis += parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0;
            totalKgExportable += parseFloat(row.SeleccionRelacione?.Seleccion?.exportable) || 0;
            embalajes.forEach(emb => {
                // Cajas Exportar (todas las cajas)
                totalCajasExportar += parseInt(emb.numeroDeCajas) || 0;
                // 12 x 100
                if (emb.tipoPresentacion?.nombre === '12 x 100') {
                    totalCajas12x100 += parseInt(emb.numeroDeCajas) || 0;
                    totalKg12x100 += parseFloat(emb.kgEmpacado) || 0;
                }
                // Granel
                if (emb.tipoPresentacion?.nombre === 'GRANEL') {
                    totalCajasGranel += parseInt(emb.numeroDeCajas) || 0;
                    totalKgGranel += parseFloat(emb.kgEmpacado) || 0;
                }
                // Gulupa (G-CON)
                if (emb.tipoPresentacion?.nombre === 'G-CON') {
                    totalCajasGulupa += parseInt(emb.numeroDeCajas) || 0;
                    totalKgGulupa += parseFloat(emb.kgEmpacado) || 0;
                }
                // Totales generales
                totalCajas += parseInt(emb.numeroDeCajas) || 0;
                totalKg += parseFloat(emb.kgEmpacado) || 0;
            });
        });
        return {
            registros: remisionesFiltradas.length,
            totalCajasExportar,
            totalCajas12x100,
            totalKg12x100,
            totalCajasGranel,
            totalKgGranel,
            totalCajasGulupa,
            totalKgGulupa,
            totalCajas,
            totalKg,
            totalKgBruto,
            totalKgNeto,
            totalKgMagullada,
            totalKgRajado,
            totalKgBotritis,
            totalKgExportable
        };
    }, [remisionesFiltradas]);

    useEffect(() => {
        async function fetchRemisiones() {
            setLoading(true);
            try {
                const data = await getAllRemisiones();
                setRemisiones(data);
            } catch (err) {
                setError('Error al cargar los datos');
                setRemisiones([]);
            } finally {
                setLoading(false);
            }
        }
        fetchRemisiones();
    }, []);

    useEffect(() => {
        if (!loading) {
            console.log('Remisiones:', remisiones);
        }
    }, [loading, remisiones]);

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleDateFilter = async () => {
        setLoading(true);
        try {
            const data = await getAllRemisiones(startDate, endDate);
            setRemisiones(data);
        } catch (err) {
            setError('Error al filtrar los datos');
            setRemisiones([]);
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Balance de Masas</h1>

            {/* Botón de exportación con exceljs */}
            <button
                onClick={() => exportarBalanceExceljs(remisionesFiltradas)}
                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Exportar a Excel
            </button>

            {/* Filtro por productor y embarque */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <select
                    value={selectedProductor}
                    onChange={e => setSelectedProductor(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los productores</option>
                    {productoresUnicos.map(prod => (
                        <option key={prod.nombre} value={prod.nombre}>
                            {prod.nombre}{prod.ggn ? ` (GGN: ${prod.ggn})` : ''}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedEmbarque}
                    onChange={e => setSelectedEmbarque(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todos los embarques</option>
                    {embarquesUnicos.map(emb => (
                        <option key={emb.numero} value={emb.numero}>{emb.numero}</option>
                    ))}
                </select>
                <select
                    value={selectedPresentacion}
                    onChange={e => setSelectedPresentacion(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Todas las presentaciones</option>
                    {presentacionesUnicas.map(pres => (
                        <option key={pres.nombre} value={pres.nombre}>{pres.nombre}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fecha inicio"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fecha fin"
                />
                <button
                    onClick={handleDateFilter}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Filtrar
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Fecha Recepción</th>
                            <th className="px-4 py-2">Remisión</th>
                            <th className="px-4 py-2">Registro de Aplicación</th>
                            <th className="px-4 py-2">Productor</th>
                            <th className="px-4 py-2">Especie</th>
                            {/* <th className="px-4 py-2">Municipio</th> */}
                            <th className="px-4 py-2">Predio</th>
                            <th className="px-4 py-2">Registro ICA</th>
                            <th className="px-4 py-2">GGN</th>
                            <th className="px-4 py-2">Código</th>
                            <th className="px-4 py-2">Trazabilidad</th>
                            <th className="px-4 py-2">Canastas</th>
                            <th className="px-4 py-2">Kg Bruto</th>
                            <th className="px-4 py-2">Kg Neto</th>
                            <th className="px-4 py-2">Peso Canastas</th>
                            <th className="px-4 py-2">Índice de Conversión</th>
                            <th className="px-4 py-2">Kg Magullada</th>
                            <th className="px-4 py-2">Kg Rajado</th>
                            <th className="px-4 py-2">Kg Botritis</th>
                            <th className="px-4 py-2">Kg Exportable</th>
                            <th className="px-4 py-2">% Pérdida</th>
                            <th className="px-4 py-2">Cajas Exportar</th>
                            <th className="px-4 py-2">Presentación</th>
                            <th className="px-4 py-2">Cajas 12*100</th>
                            <th className="px-4 py-2">Kg 12*100</th>
                            <th className="px-4 py-2">Cajas Granel</th>
                            <th className="px-4 py-2">Kg Granel</th>
                            <th className="px-4 py-2">Cajas Gulupa</th>
                            <th className="px-4 py-2">Kg Gulupa</th>
                            <th className="px-4 py-2">Factura</th>
                            <th className="px-4 py-2">Embarque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {remisionesFiltradas.map((row) => {
                            const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
                            const rowSpan = embalajes.length > 0 ? embalajes.length : 1;
                            return (
                                <React.Fragment key={row.id}>
                                    {/* Fila madre y subfilas con rowspan */}
                                    {embalajes.length > 0 ? (
                                        embalajes.map((emb, embIdx) => {
                                            if (embIdx === 0) {
                                                // Solo para depuración, mostrar el embalaje en consola
                                                console.log('Embalaje:', emb);
                                            }
                                            return (
                                                <tr key={emb.id} className={`border border-black/20 ${row.RemisionRelaciones[0]?.productor?.GGNs?.length > 0 ? 'bg-green-100' : ''}`}>
                                                    {/* Solo en la primera subfila, renderizar las celdas generales con rowspan */}
                                                    {embIdx === 0 && (
                                                        <>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.numero}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.registroAplicacion}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones?.[0]?.productor?.nombre || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones[0]?.lote?.frutaLote?.frutum?.nombre || ''}</td>
                                                            {/* <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones?.[0]?.finca?.municipio || ''}</td> */}
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones?.[0]?.finca?.nombre || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones[0]?.Certica?.numero}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones[0]?.productor?.GGNs[0]?.numero || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones?.[0]?.finca?.codigo || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.RemisionRelaciones?.[0]?.Trazabilidad?.numero || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.numeroCanastas}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.brutoKg}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.netoFrutaKg}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.netoCanastas}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? (Number(row.brutoKg) / Number(row.netoFrutaKg)).toFixed(2) : ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.SeleccionRelacione?.Seleccion?.magullado || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.SeleccionRelacione?.Seleccion?.rajado || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.SeleccionRelacione?.Seleccion?.botritis || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.SeleccionRelacione?.Seleccion?.exportable || ''}</td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{(() => { 
                                                                                                                    const magullado = parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0; 
                                                                                                                    const rajado = parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0; 
                                                                                                                    const botritis = parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0; 
                                                                                                                    const exportable = parseFloat(row.SeleccionRelacione?.Seleccion?.exportable) || 0;
                                                                                                                    const seleccion = magullado + rajado + botritis + exportable;
                                                                                                                    const neto = parseFloat(row.netoFrutaKg) || 0; 
                                                                                                                    const perdidaseleccion = (((neto - seleccion) / neto) * 100).toFixed(2);

                                                                                                                    const sumaKilosEmpacados = row.embalajes?.reduce((sum, e) => sum + parseFloat(e.kgEmpacado || 0), 0) || 0;
                                                                                                                    const perdidaEmbalaje = (((exportable - sumaKilosEmpacados)/ neto)* 100).toFixed(2)
                                                                                                                    if (neto === 0) return ''; 
                                                                                                                    return (parseFloat(perdidaseleccion) + parseFloat(perdidaEmbalaje)).toFixed(2) + '%'; 
                                                                                                                }
                                                                                                          )()}
                                                            </td>
                                                            <td className="px-4 py-2" rowSpan={rowSpan}>{embalajes.reduce((acc, emb) => acc + (parseInt(emb.numeroDeCajas) || 0), 0)}</td>
                                                        </>
                                                    )}
                                                    {/* Subfila: solo datos de embalaje */}
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.presentacion?.nombre || ''}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === '12 x 100' ? emb.numeroDeCajas : 0}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === '12 x 100' ? emb.kgEmpacado : 0}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === 'GRANEL' ? emb.numeroDeCajas : 0}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === 'GRANEL' ? emb.kgEmpacado : 0}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === 'G-CON' ? emb.numeroDeCajas : 0}</td>
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.tipoPresentacion?.nombre === 'G-CON' ? emb.kgEmpacado : 0}</td>
                                                
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.embarque?.Factura?.numero || 'Sin factura'}</td>
                                                
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.embarque?.numero || ''}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        // Si no hay embalajes, una sola fila normal
                                        <tr className={`border border-black/20 ${row.RemisionRelaciones[0]?.productor?.GGNs?.length > 0 ? 'bg-green-100' : ''}`}>
                                            <td className="px-4 py-2">{row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : ''}</td>
                                            <td className="px-4 py-2">{row.numero}</td>
                                            <td className="px-4 py-2">{row.registroAplicacion}</td>
                                            <td className="px-4 py-2">{row.RemisionRelaciones[0]?.productor?.nombre || ''}</td>
                                            <td className="px-4 py-2">{row.RemisionRelaciones[0]?.lote?.frutaLote?.frutum?.nombre || ''}</td>
                                            {/* <td className="px-4 py-2">{row.RemisionRelaciones?.[0]?.finca?.municipio || ''}</td> */}
                                            <td className="px-4 py-2">{row.RemisionRelaciones[0]?.finca?.nombre || ''}</td>
                                            <td className="px-4 py-2" rowSpan={rowSpan}> Acá Registro ICA</td>
                                            <td className="px-4 py-2" rowSpan={rowSpan}>Acá GGN</td>
                                            <td className="px-4 py-2">{row.RemisionRelaciones[0]?.finca?.codigo || ''}</td>
                                            <td className="px-4 py-2">{row.RemisionRelaciones[0]?.Trazabilidad?.numero || ''}</td>
                                            <td className="px-4 py-2">{row.numeroCanastas}</td>
                                            <td className="px-4 py-2">{row.brutoKg}</td>
                                            <td className="px-4 py-2">{row.netoFrutaKg}</td>
                                            <td className="px-4 py-2">{row.netoCanastas}</td>
                                            <td className="px-4 py-2">{row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? (Number(row.brutoKg) / Number(row.netoFrutaKg)).toFixed(2) : ''}</td>
                                            <td className="px-4 py-2">{row.SeleccionRelacione?.Seleccion?.magullado || ''}</td>
                                            <td className="px-4 py-2">{row.SeleccionRelacione?.Seleccion?.rajado || ''}</td>
                                            <td className="px-4 py-2">{row.SeleccionRelacione?.Seleccion?.botritis || ''}</td>
                                            <td className="px-4 py-2" rowSpan={rowSpan}>{row.SeleccionRelacione?.Seleccion?.exportable || ''}</td>
                                            <td className="px-4 py-2">{(() => { const magullado = parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0; const rajado = parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0; const botritis = parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0; const neto = parseFloat(row.netoFrutaKg) || 0; if (neto === 0) return ''; return (((magullado + rajado + botritis) / neto) * 100).toFixed(2) + '%'; })()}</td>
                                            <td className="px-4 py-2">{embalajes.reduce((acc, emb) => acc + (parseInt(emb.numeroDeCajas) || 0), 0)}</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {/* Fila de totales */}
                        <tr className="bg-gray-200 font-bold">
                            <td className="px-4 py-2" colSpan={1}>Totales</td>
                            <td className="px-4 py-2" colSpan={9}>Registros: {totales.registros}</td>
                            <td className="px-4 py-2" colSpan={1}></td>
                            <td className="px-4 py-2">{totales.totalKgBruto.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalKgNeto.toFixed(2)}</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2">{totales.totalKgMagullada.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalKgRajado.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalKgBotritis.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalKgExportable.toFixed(2)}</td>
                            <td className="px-4 py-2" colSpan={1}></td>
                            <td className="px-4 py-2">{totales.totalCajasExportar}</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2">{totales.totalCajas12x100}</td>
                            <td className="px-4 py-2">{totales.totalKg12x100.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalCajasGranel}</td>
                            <td className="px-4 py-2">{totales.totalKgGranel.toFixed(2)}</td>
                            <td className="px-4 py-2">{totales.totalCajasGulupa}</td>
                            <td className="px-4 py-2">{totales.totalKgGulupa.toFixed(2)}</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                        </tr>
                        {/* Fila de totales generales */}
                        <tr className="bg-gray-100 font-bold">
                            <td className="px-4 py-2" colSpan={21}>Total cajas: {totales.totalCajas} | Total kg: {totales.totalKg.toFixed(2)}</td>
                            <td className="px-4 py-2" colSpan={8}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BalanceDeMasas; 