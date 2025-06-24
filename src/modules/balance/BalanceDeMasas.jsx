import React, { useState, useEffect } from 'react';
import { getAllRemisiones } from '../../services/remisionService';
import { exportarBalance } from './ExportarBalanceExcel';

const BalanceDeMasas = () => {
    const [remisiones, setRemisiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

            <button
                onClick={() => exportarBalance(remisiones)}
                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Exportar a Excel
            </button>

            <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
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
                        {remisiones.map((row) => {
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
                                                    <td className={`px-4 py-2 ${emb.presentacion?.nombre === 'TROFI GGN CoC' ? 'bg-yellow-100' : ''}`}>{emb.embarque?.Facturas[0]?.numero || 'Sin factura'}</td>
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
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BalanceDeMasas; 