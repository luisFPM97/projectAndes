import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function formatNumber(num) {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '';
    return Number(num).toFixed(2).replace('.', ',');
}

// Estilos para celdas
const styleHeader = { font: { bold: true }, fill: { fgColor: { rgb: 'D9D9D9' } } };
const styleTotal = { font: { bold: true }, fill: { fgColor: { rgb: 'E5E5E5' } } };
const styleTROFI = { fill: { fgColor: { rgb: 'FFFACD' } } }; // amarillo claro
const styleGGN = { fill: { fgColor: { rgb: 'D9F9D9' } } }; // verde claro
const styleDefault = { fill: { fgColor: { rgb: 'FFFFFF' } } };

export function exportarBalance(remisiones) {
    const headers = [
        'Fecha Recepción', 'Remisión', 'Registro de Aplicación', 'Productor', 'Especie', 'Predio', 'Registro ICA', 'GGN', 'Código', 'Trazabilidad',
        'Canastas', 'Kg Bruto', 'Kg Neto', 'Peso Canastas', 'Índice de Conversión', 'Kg Magullada', 'Kg Rajado', 'Kg Botritis', 'Kg Exportable', '% Pérdida',
        'Cajas Exportar', 'Presentación', 'Cajas 12 x 100', 'Kg 12 x 100', 'Cajas Granel', 'Kg Granel', 'Cajas Gulupa', 'Kg Gulupa', 'Factura', 'Embarque'
    ];
    const rows = [];
    const merges = [];
    let currentRow = 1; // 0 es headers
    // Para estilos
    const styledRows = [];

    remisiones.forEach(row => {
        const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
        const rowSpan = embalajes.length > 0 ? embalajes.length : 1;
        const productorGGN = row.RemisionRelaciones?.[0]?.productor?.GGNs?.[0]?.numero;
        if (embalajes.length > 0) {
            embalajes.forEach((emb, embIdx) => {
                const isTROFI = emb.presentacion?.nombre === 'TROFI GGN CoC';
                // Solo en la primera subfila, agrega los datos generales de la remisión
                const base = embIdx === 0 ? [
                    row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : '',
                    row.numero,
                    row.registroAplicacion,
                    row.RemisionRelaciones?.[0]?.productor?.nombre || '',
                    row.RemisionRelaciones?.[0]?.lote?.frutaLote?.frutum?.nombre || '',
                    row.RemisionRelaciones?.[0]?.finca?.nombre || '',
                    row.RemisionRelaciones?.[0]?.Certica?.numero || '',
                    row.RemisionRelaciones?.[0]?.productor?.GGNs?.[0]?.numero || '',
                    row.RemisionRelaciones?.[0]?.finca?.codigo || '',
                    row.RemisionRelaciones?.[0]?.Trazabilidad?.numero || '',
                    row.numeroCanastas,
                    formatNumber(row.brutoKg),
                    formatNumber(row.netoFrutaKg),
                    formatNumber(row.netoCanastas),
                    row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? formatNumber(Number(row.brutoKg) / Number(row.netoFrutaKg)) : '',
                    formatNumber(row.SeleccionRelacione?.Seleccion?.magullado),
                    formatNumber(row.SeleccionRelacione?.Seleccion?.rajado),
                    formatNumber(row.SeleccionRelacione?.Seleccion?.botritis),
                    formatNumber(row.SeleccionRelacione?.Seleccion?.exportable),
                    (() => { 
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
                        return (parseFloat(perdidaseleccion) + parseFloat(perdidaEmbalaje)).toFixed(2).replace('.', ',') + '%'; 
                    })(),
                    embalajes.reduce((acc, emb) => acc + (parseInt(emb.numeroDeCajas) || 0), 0)
                ] : Array(21).fill('');
                // Subfila: datos de embalaje
                const rowData = [
                    ...base,
                    emb.presentacion?.nombre || '',
                    emb.tipoPresentacion?.nombre === '12 x 100' ? emb.numeroDeCajas : 0,
                    emb.tipoPresentacion?.nombre === '12 x 100' ? formatNumber(emb.kgEmpacado) : 0,
                    emb.tipoPresentacion?.nombre === 'GRANEL' ? emb.numeroDeCajas : 0,
                    emb.tipoPresentacion?.nombre === 'GRANEL' ? formatNumber(emb.kgEmpacado) : 0,
                    emb.tipoPresentacion?.nombre === 'G-CON' ? emb.numeroDeCajas : 0,
                    emb.tipoPresentacion?.nombre === 'G-CON' ? formatNumber(emb.kgEmpacado) : 0,
                    emb.embarque?.Factura?.numero || 'Sin factura',
                    emb.embarque?.numero || ''
                ];
                rows.push(rowData);
                // Estilos de la fila
                const styleRow = [];
                for (let i = 0; i < rowData.length; i++) {
                    if (i < 21 && productorGGN) {
                        styleRow.push(styleGGN);
                    } else if (i >= 21 && isTROFI) {
                        styleRow.push(styleTROFI);
                    } else {
                        styleRow.push(styleDefault);
                    }
                }
                styledRows.push(styleRow);
            });
            // Agregar merges para columnas generales si hay más de 1 embalaje
            if (rowSpan > 1) {
                for (let col = 0; col < 21; col++) {
                    merges.push({ s: { r: currentRow, c: col }, e: { r: currentRow + rowSpan - 1, c: col } });
                }
            }
            currentRow += rowSpan;
        } else {
            // Si no hay embalajes, una sola fila normal
            const rowData = [
                row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : '',
                row.numero,
                row.registroAplicacion,
                row.RemisionRelaciones?.[0]?.productor?.nombre || '',
                row.RemisionRelaciones?.[0]?.lote?.frutaLote?.frutum?.nombre || '',
                row.RemisionRelaciones?.[0]?.finca?.nombre || '',
                row.RemisionRelaciones?.[0]?.Certica?.numero || '',
                row.RemisionRelaciones?.[0]?.productor?.GGNs?.[0]?.numero || '',
                row.RemisionRelaciones?.[0]?.finca?.codigo || '',
                row.RemisionRelaciones?.[0]?.Trazabilidad?.numero || '',
                row.numeroCanastas,
                formatNumber(row.brutoKg),
                formatNumber(row.netoFrutaKg),
                formatNumber(row.netoCanastas),
                row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? formatNumber(Number(row.brutoKg) / Number(row.netoFrutaKg)) : '',
                formatNumber(row.SeleccionRelacione?.Seleccion?.magullado),
                formatNumber(row.SeleccionRelacione?.Seleccion?.rajado),
                formatNumber(row.SeleccionRelacione?.Seleccion?.botritis),
                formatNumber(row.SeleccionRelacione?.Seleccion?.exportable),
                (() => { const magullado = parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0; const rajado = parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0; const botritis = parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0; const neto = parseFloat(row.netoFrutaKg) || 0; if (neto === 0) return ''; return (((magullado + rajado + botritis) / neto) * 100).toFixed(2).replace('.', ',') + '%'; })(),
                0, '', 0, 0, 0, 0, 0, 0, 'Sin factura', ''
            ];
            rows.push(rowData);
            // Estilos de la fila
            const styleRow = [];
            for (let i = 0; i < rowData.length; i++) {
                if (i < 21 && productorGGN) {
                    styleRow.push(styleGGN);
                } else {
                    styleRow.push(styleDefault);
                }
            }
            styledRows.push(styleRow);
            currentRow += 1;
        }
    });
    // Calcular totales
    let totalCajasExportar = 0;
    let totalCajas12x100 = 0;
    let totalKg12x100 = 0;
    let totalCajasGranel = 0;
    let totalKgGranel = 0;
    let totalCajasGulupa = 0;
    let totalKgGulupa = 0;
    let totalCajas = 0;
    let totalKg = 0;
    let registros = 0;
    remisiones.forEach(row => {
        const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
        if (embalajes.length > 0) {
            registros++;
            embalajes.forEach(emb => {
                totalCajasExportar += parseInt(emb.numeroDeCajas) || 0;
                if (emb.tipoPresentacion?.nombre === '12 x 100') {
                    totalCajas12x100 += parseInt(emb.numeroDeCajas) || 0;
                    totalKg12x100 += parseFloat(emb.kgEmpacado) || 0;
                }
                if (emb.tipoPresentacion?.nombre === 'GRANEL') {
                    totalCajasGranel += parseInt(emb.numeroDeCajas) || 0;
                    totalKgGranel += parseFloat(emb.kgEmpacado) || 0;
                }
                if (emb.tipoPresentacion?.nombre === 'G-CON') {
                    totalCajasGulupa += parseInt(emb.numeroDeCajas) || 0;
                    totalKgGulupa += parseFloat(emb.kgEmpacado) || 0;
                }
                totalCajas += parseInt(emb.numeroDeCajas) || 0;
                totalKg += parseFloat(emb.kgEmpacado) || 0;
            });
        }
    });
    // Fila de totales por columna
    const filaTotales = [
        'Totales', '', '', `Registros: ${registros}`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        totalCajasExportar, '', totalCajas12x100, formatNumber(totalKg12x100), totalCajasGranel, formatNumber(totalKgGranel), totalCajasGulupa, formatNumber(totalKgGulupa), '', ''
    ];
    // Fila de totales generales
    const filaTotalesGenerales = [
        `Total cajas: ${totalCajas} | Total kg: ${formatNumber(totalKg)}`
    ];
    while (filaTotalesGenerales.length < headers.length) {
        filaTotalesGenerales.push('');
    }

    // Construir hoja con estilos
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows, filaTotales, filaTotalesGenerales]);
    ws['!merges'] = merges;

    // Aplicar estilos a encabezado
    for (let c = 0; c < headers.length; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
        if (cell) cell.s = styleHeader;
    }
    // Aplicar estilos a filas de datos
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < headers.length; c++) {
            const cell = ws[XLSX.utils.encode_cell({ r: r + 1, c })];
            if (cell) cell.s = styledRows[r][c];
        }
    }
    // Aplicar estilos a totales
    for (let c = 0; c < headers.length; c++) {
        const cellTot = ws[XLSX.utils.encode_cell({ r: rows.length + 1, c })];
        if (cellTot) cellTot.s = styleTotal;
        const cellTotGen = ws[XLSX.utils.encode_cell({ r: rows.length + 2, c })];
        if (cellTotGen) cellTotGen.s = styleTotal;
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'balance.xlsx');
} 