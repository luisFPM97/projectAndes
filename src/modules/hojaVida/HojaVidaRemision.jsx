import React, { useState } from 'react';
import { getRemisionById } from '../../services/remisionService';
import { PDFDownloadLink } from '@react-pdf/renderer';
import HojaVidaPDF from './HojaVidaPDF';

const HojaVidaRemision = () => {
    const [remision, setRemision] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState('');
    
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            setError('Por favor ingrese un número de remisión');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getRemisionById(searchId);
            setRemision(data);
            console.log(data)
        } catch (err) {
            setError('Error al cargar la remisión. Verifique el número e intente nuevamente.');
            console.error('Error:', err);
            setRemision(null);
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

    const totalEmpacado = (parseFloat(remision?.SeleccionRelacione?.Seleccion?.exportable || 0) +
                           parseFloat(remision?.SeleccionRelacione?.Seleccion?.botritis || 0) +
                           parseFloat(remision?.SeleccionRelacione?.Seleccion?.magullado || 0) +
                           parseFloat(remision?.SeleccionRelacione?.Seleccion?.rajado || 0)).toFixed(2);

    const perdidaTotal = (parseFloat(remision?.netoFrutaKg || 0) - parseFloat(totalEmpacado)).toFixed(2);

    const porcentajePerdida = (remision?.netoFrutaKg ? (parseFloat(perdidaTotal) / parseFloat(remision.netoFrutaKg) * 100) : 0).toFixed(2);

    // Variables para la nueva sección de pérdida
    const kilosExportables = parseFloat(remision?.SeleccionRelacione?.Seleccion?.exportable || 0);
    const sumaKilosEmpacados = remision?.embalajes?.reduce((sum, e) => sum + parseFloat(e.kgEmpacado || 0), 0) || 0;
    const netoIngreso = parseFloat(remision?.netoFrutaKg || 0);
    const nuevaPerdida = (kilosExportables - sumaKilosEmpacados).toFixed(2);
    const porcentajeNuevaPerdida = (netoIngreso ? (parseFloat(nuevaPerdida) / netoIngreso * 100) : 0).toFixed(2);
    const nuevaPerdidaTotal = (parseFloat(perdidaTotal) + parseFloat(nuevaPerdida)).toFixed(2);
    const porcentajetotal = (
        parseFloat(porcentajePerdida) + parseFloat(porcentajeNuevaPerdida)
      ).toFixed(2);
    return (
        <div className="flex-1 h-screen bg-gray-50 ">
            <div className="flex justify-between items-center mb-6 flex-1 p-4 lg:p-8 overflow-y-auto ml-0 lg:ml-64">
                <h1 className="text-2xl font-bold text-gray-800">Hoja de Vida de Remisión</h1>
            </div>

            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Ingrese el número de remisión..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {remision && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Remisión {remision.numero}</h2>
                            <PDFDownloadLink
                                document={<HojaVidaPDF remision={remision} />}
                                fileName={`hoja-vida-remision-${remision.numero}.pdf`}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {({ loading }) => loading ? 'Generando...' : 'Descargar PDF'}
                            </PDFDownloadLink>
                        </div>

                        <div className="space-y-6">
                            {/* Sección de Recepción */}
                            <div>
                                <h3 className="titulo text-lg  font-semibold mb-3">Recepción</h3>
                                <div className="grid grid-cols-2 gap-4"><div>
                                        <p className="text-sm text-gray-600">Fecha de Selección</p>
                                        <p className="font-medium">
                                            {new Date(remision.fechaCosecha).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>                                    
                                    <div>
                                        <p className="text-sm text-gray-600">Productor</p>
                                        <p className="font-medium">{remision.RemisionRelaciones?.[0]?.productor?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Finca</p>
                                        <p className="font-medium">{remision.RemisionRelaciones?.[0]?.finca?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Lote</p>
                                        <p className="font-medium">{remision.RemisionRelaciones?.[0]?.lote?.numero}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Bruto (kg)</p>
                                        <p className="font-medium">{parseFloat(remision.brutoKg).toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Neto Canastas</p>
                                        <p className="font-medium">{parseFloat(remision.netoCanastas).toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Número de Canastas</p>
                                        <p className="font-medium">{remision.numeroCanastas}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Registro de Aplicación</p>
                                        <p className="font-medium">{remision.registroAplicacion}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tipo de Fruta</p>
                                        <p className="font-medium">{remision.RemisionRelaciones?.[0]?.Tipofrutum?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Registro ICA</p>
                                        <p className="font-medium">{remision.RemisionRelaciones?.[0]?.Certica?.numero}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Devolución en Puerta</p>
                                        <p className="font-medium">{parseFloat(remision.devolucionPuerta).toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Neto Fruta</p>
                                        <p className="font-medium">{parseFloat(remision.netoFrutaKg).toFixed(2)} kg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Selección */}
                            <div>
                                <h3 className="titulo text-lg font-semibold mb-3">Selección</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha de Selección</p>
                                        <p className="font-medium">
                                            {new Date(remision.SeleccionRelacione?.Seleccion.fechaSeleccion).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Magullado</p>
                                        <p className="font-medium">{remision.SeleccionRelacione?.Seleccion?.magullado} Kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Rajado</p>
                                        <p className="font-medium">{remision.SeleccionRelacione?.Seleccion?.rajado} Kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Botritis</p>
                                        <p className="font-medium">{remision.SeleccionRelacione?.Seleccion?.botritis} Kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Exportable</p>
                                        <p className="font-medium">{remision.SeleccionRelacione?.Seleccion?.exportable} Kg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Pérdida */}
                            <div>
                                <h3 className="titulo text-lg font-semibold mb-3">Pérdida</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Neto Ingreso</p>
                                        <p className="font-medium">{parseFloat(remision.netoFrutaKg).toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Peso selección</p>
                                        <p className="font-medium">{totalEmpacado} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pérdida</p>
                                        <p className="font-medium text-red-600">{perdidaTotal} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Porcentaje</p>
                                        <p className="font-medium text-red-600">{porcentajePerdida}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nueva Sección de Pérdida */}
                            <div>
                                <h3 className="titulo text-lg font-semibold mb-3">Pérdida Exportable vs Empacado</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Exportable</p>
                                        <p className="font-medium">{kilosExportables.toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Empacado</p>
                                        <p className="font-medium">{sumaKilosEmpacados.toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pérdida</p>
                                        <p className="font-medium text-red-600">{nuevaPerdida} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Porcentaje</p>
                                        <p className="font-medium text-red-600">{porcentajeNuevaPerdida}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nueva Pérdida Total</p>
                                        <p className="font-medium text-red-600">{nuevaPerdidaTotal} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Porcentaje Total Pérdida</p>
                                        <p className="font-medium text-red-600">{porcentajetotal}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Embalaje */}
                            <div>
                                <h3 className="titulo text-lg font-semibold mb-3">Embalaje</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Embarque
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estiba
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha Empaque
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Presentacion
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo fruta
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Número de Cajas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kg Empacados
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {remision.embalajes?.map((embalaje) => (
                                                <tr key={embalaje.id}
                                                    className={
                                                        embalaje?.presentacion?.nombre === "TROFI GGN CoC"
                                                            ? "bg-green-100"
                                                            : ""
                                                    }
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {embalaje.embarque?.numero}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {embalaje.estiba}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(embalaje.fechaDeEmpaque).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {embalaje?.presentacion?.nombre}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {embalaje?.tipoPresentacion?.nombre}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {embalaje.numeroDeCajas}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {parseFloat(embalaje.kgEmpacado).toFixed(2)} kg
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50">
                                                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Totales
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {remision.embalajes?.reduce((sum, e) => sum + e.numeroDeCajas, 0)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {remision.embalajes?.reduce((sum, e) => sum + parseFloat(e.kgEmpacado), 0).toFixed(2)} kg
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HojaVidaRemision; 