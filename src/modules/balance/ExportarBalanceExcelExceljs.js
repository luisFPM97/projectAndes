import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function formatNumber(num) {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '';
    return Number(num).toFixed(2).replace('.', ',');
}

export async function exportarBalanceExceljs(remisiones) {
    const headers = [
        'Fecha Recepción', 'Remisión', 'Registro de Aplicación', 'Productor', 'Especie', 'Predio', 'Registro ICA', 'GGN', 'Código', 'Trazabilidad',
        'Canastas', 'Kg Bruto', 'Kg Neto', 'Peso Canastas', 'Índice de Conversión', 'Kg Magullada', 'Kg Rajado', 'Kg Botritis', 'Kg Exportable', '% Pérdida',
        'Cajas Exportar', 'Presentación', 'Cajas 12 x 100', 'Kg 12 x 100', 'Cajas Granel', 'Kg Granel', 'Cajas Gulupa', 'Kg Gulupa', 'Factura', 'Embarque'
    ];
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Balance');

    // Estilos
    const styleHeader = { bold: true, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } } };
    const styleTotal = { bold: true, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E5E5' } } };
    const styleTROFI = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFACD' } } };
    const styleGGN = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9F9D9' } } };
    const styleDefault = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } } };

    ws.addRow(headers);
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = styleHeader.fill;

    let currentRow = 2;
    remisiones.forEach(row => {
        const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
        const rowSpan = embalajes.length > 0 ? embalajes.length : 1;
        const productorGGN = row.RemisionRelaciones?.[0]?.productor?.GGNs?.[0]?.numero;
        if (embalajes.length > 0) {
            embalajes.forEach((emb, embIdx) => {
                const isTROFI = emb.presentacion?.nombre === 'TROFI GGN CoC';
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
                ws.addRow(rowData);
                // Estilos
                const excelRow = ws.getRow(currentRow);
                for (let i = 0; i < rowData.length; i++) {
                    if (i < 21 && productorGGN) {
                        excelRow.getCell(i + 1).fill = styleGGN.fill;
                    } else if (i >= 21 && isTROFI) {
                        excelRow.getCell(i + 1).fill = styleTROFI.fill;
                    } else {
                        excelRow.getCell(i + 1).fill = styleDefault.fill;
                    }
                }
                currentRow++;
            });
            // Merges para columnas generales
            if (rowSpan > 1) {
                for (let col = 1; col <= 21; col++) {
                    ws.mergeCells(currentRow - rowSpan, col, currentRow - 1, col);
                }
            }
        } else {
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
            ws.addRow(rowData);
            const excelRow = ws.getRow(currentRow);
            for (let i = 0; i < rowData.length; i++) {
                if (i < 21 && productorGGN) {
                    excelRow.getCell(i + 1).fill = styleGGN.fill;
                } else {
                    excelRow.getCell(i + 1).fill = styleDefault.fill;
                }
            }
            currentRow++;
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
    let totalKgBruto = 0;
    let totalKgNeto = 0;
    let totalKgMagullada = 0;
    let totalKgRajado = 0;
    let totalKgBotritis = 0;
    let totalKgExportable = 0;
    remisiones.forEach(row => {
        const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
        totalKgBruto += parseFloat(row.brutoKg) || 0;
        totalKgNeto += parseFloat(row.netoFrutaKg) || 0;
        totalKgMagullada += parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0;
        totalKgRajado += parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0;
        totalKgBotritis += parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0;
        totalKgExportable += parseFloat(row.SeleccionRelacione?.Seleccion?.exportable) || 0;
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
        'Totales', '', '', `Registros: ${registros}`, '', '', '', '', '', '', '',
        totalKgBruto.toFixed(2),
        totalKgNeto.toFixed(2),
        '', '',
        totalKgMagullada.toFixed(2),
        totalKgRajado.toFixed(2),
        totalKgBotritis.toFixed(2),
        totalKgExportable.toFixed(2),
        '',
        totalCajasExportar, '', totalCajas12x100, formatNumber(totalKg12x100), totalCajasGranel, formatNumber(totalKgGranel), totalCajasGulupa, formatNumber(totalKgGulupa), '', ''
    ];
    ws.addRow(filaTotales);
    ws.getRow(ws.rowCount).font = { bold: true };
    ws.getRow(ws.rowCount).fill = styleTotal.fill;
    // Fila de totales generales
    const filaTotalesGenerales = [
        `Total cajas: ${totalCajas} | Total kg: ${formatNumber(totalKg)}`
    ];
    while (filaTotalesGenerales.length < headers.length) {
        filaTotalesGenerales.push('');
    }
    ws.addRow(filaTotalesGenerales);
    ws.getRow(ws.rowCount).font = { bold: true };
    ws.getRow(ws.rowCount).fill = styleTotal.fill;

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'balance-exceljs.xlsx');
} 