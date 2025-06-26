import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    twoColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 20,
    },
    column: {
        flex: 1,
        marginRight: 10,
    },
    columnRight: {
        flex: 1,
        marginLeft: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#222',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '45%',
        fontWeight: 'bold',
    },
    value: {
        width: '55%',
    },
    table: {
        marginTop: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        paddingVertical: 5,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        padding: 5,
    },
    totalRow: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const HojaVidaPDF = ({ remision }) => {
    const remisionRelacion = remision.RemisionRelaciones?.[0];
    console.log(remision)
    // Cálculos igual que en el HTML
    const totalEmpacado = (
        parseFloat(remision?.SeleccionRelacione?.Seleccion?.exportable || 0) +
        parseFloat(remision?.SeleccionRelacione?.Seleccion?.botritis || 0) +
        parseFloat(remision?.SeleccionRelacione?.Seleccion?.magullado || 0) +
        parseFloat(remision?.SeleccionRelacione?.Seleccion?.rajado || 0)
    ).toFixed(2);
    const perdidaTotal = (parseFloat(remision?.netoFrutaKg || 0) - parseFloat(totalEmpacado)).toFixed(2);
    const porcentajePerdida = (remision?.netoFrutaKg ? (parseFloat(perdidaTotal) / parseFloat(remision.netoFrutaKg) * 100) : 0).toFixed(2);
    const kilosExportables = parseFloat(remision?.SeleccionRelacione?.Seleccion?.exportable || 0);
    const sumaKilosEmpacados = remision?.embalajes?.reduce((sum, e) => sum + parseFloat(e.kgEmpacado || 0), 0) || 0;
    const netoIngreso = parseFloat(remision?.netoFrutaKg || 0);
    const nuevaPerdida = (kilosExportables - sumaKilosEmpacados).toFixed(2);
    const porcentajeNuevaPerdida = (netoIngreso ? (parseFloat(nuevaPerdida) / netoIngreso * 100) : 0).toFixed(2);
    const nuevaPerdidaTotal = (parseFloat(perdidaTotal) + parseFloat(nuevaPerdida)).toFixed(2);
    const porcentajetotal = (parseFloat(porcentajePerdida) + parseFloat(porcentajeNuevaPerdida)).toFixed(2);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Hoja de Vida de Remisión</Text>
                    <Text>Número: {remision.numero}</Text>
                </View>

                {/* Dos columnas para los datos principales */}
                <View style={styles.twoColumns}>
                    {/* Columna Izquierda: Recepción y Selección */}
                    <View style={styles.column}>
                        {/* Sección de Recepción */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recepción</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Fecha de Selección:</Text>
                                <Text style={styles.value}>{formatDate(remision.fechaCosecha)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Productor:</Text>
                                <Text style={styles.value}>{remisionRelacion?.productor?.nombre}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Finca:</Text>
                                <Text style={styles.value}>{remisionRelacion?.finca?.nombre}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Lote:</Text>
                                <Text style={styles.value}>{remisionRelacion?.lote?.numero}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Registro de Aplicación:</Text>
                                <Text style={styles.value}>{remision.registroAplicacion}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Tipo de Fruta:</Text>
                                <Text style={styles.value}>{remisionRelacion?.Tipofrutum?.nombre}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Registro ICA:</Text>
                                <Text style={styles.value}>{remisionRelacion?.Certica?.numero}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Global G.AP:</Text>
                                <Text style={styles.value}>{remisionRelacion?.productor?.GGNs?.[0]?.numero || ''}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Bruto (kg):</Text>
                                <Text style={styles.value}>{parseFloat(remision.brutoKg).toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Neto Canastas:</Text>
                                <Text style={styles.value}>{parseFloat(remision.netoCanastas).toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Número de Canastas:</Text>
                                <Text style={styles.value}>{remision.numeroCanastas}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Devolución en Puerta:</Text>
                                <Text style={styles.value}>{parseFloat(remision.devolucionPuerta).toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Neto Fruta:</Text>
                                <Text style={styles.value}>{parseFloat(remision.netoFrutaKg).toFixed(2)} kg</Text>
                            </View>
                        </View>
                        {/* Sección de Selección */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Selección</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Fecha de Selección:</Text>
                                <Text style={styles.value}>{formatDate(remision.SeleccionRelacione?.Seleccion?.fechaSeleccion)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Magullado:</Text>
                                <Text style={styles.value}>{remision.SeleccionRelacione?.Seleccion?.magullado} Kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Rajado:</Text>
                                <Text style={styles.value}>{remision.SeleccionRelacione?.Seleccion?.rajado} Kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Botritis:</Text>
                                <Text style={styles.value}>{remision.SeleccionRelacione?.Seleccion?.botritis} Kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Exportable:</Text>
                                <Text style={styles.value}>{remision.SeleccionRelacione?.Seleccion?.exportable} Kg</Text>
                            </View>
                        </View>
                    </View>
                    {/* Columna Derecha: Pérdida y Pérdida Exportable vs Empacado */}
                    <View style={styles.columnRight}>
                        {/* Sección de Pérdida */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Pérdida</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Neto Ingreso:</Text>
                                <Text style={styles.value}>{parseFloat(remision.netoFrutaKg).toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Peso selección:</Text>
                                <Text style={styles.value}>{totalEmpacado} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Pérdida:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{perdidaTotal} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Porcentaje:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{porcentajePerdida}%</Text>
                            </View>
                        </View>
                        {/* Nueva Sección de Pérdida */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Pérdida Exportable vs Empacado</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Exportable:</Text>
                                <Text style={styles.value}>{kilosExportables.toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Empacado:</Text>
                                <Text style={styles.value}>{sumaKilosEmpacados.toFixed(2)} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Pérdida:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{nuevaPerdida} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Porcentaje:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{porcentajeNuevaPerdida}%</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Nueva Pérdida Total:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{nuevaPerdidaTotal} kg</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: 'red' }]}>Porcentaje Total Pérdida:</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{porcentajetotal}%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Sección de Embalaje (ancho completo) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Embalaje</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Embarque</Text>
                            <Text style={styles.tableCell}>Estiba</Text>
                            <Text style={styles.tableCell}>Fecha Empaque</Text>
                            <Text style={styles.tableCell}>Presentación</Text>
                            <Text style={styles.tableCell}>Tipo fruta</Text>
                            <Text style={styles.tableCell}>Número de Cajas</Text>
                            <Text style={styles.tableCell}>Kg Empacados</Text>
                        </View>
                        {remision.embalajes?.map((embalaje) => (
                            <View key={embalaje.id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{embalaje.embarque?.numero}</Text>
                                <Text style={styles.tableCell}>{embalaje.estiba}</Text>
                                <Text style={styles.tableCell}>{formatDate(embalaje.fechaDeEmpaque)}</Text>
                                <Text style={styles.tableCell}>{embalaje?.presentacion?.nombre}</Text>
                                <Text style={styles.tableCell}>{embalaje?.tipoPresentacion?.nombre}</Text>
                                <Text style={styles.tableCell}>{embalaje.numeroDeCajas}</Text>
                                <Text style={styles.tableCell}>{parseFloat(embalaje.kgEmpacado).toFixed(2)}</Text>
                            </View>
                        ))}
                        <View style={[styles.tableRow, styles.totalRow]}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}></Text>
                            <Text style={styles.tableCell}>Totales</Text>
                            <Text style={styles.tableCell}>
                                {remision.embalajes?.reduce((sum, e) => sum + e.numeroDeCajas, 0)}
                            </Text>
                            <Text style={styles.tableCell}>
                                {remision.embalajes?.reduce((sum, e) => sum + parseFloat(e.kgEmpacado), 0).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default HojaVidaPDF; 