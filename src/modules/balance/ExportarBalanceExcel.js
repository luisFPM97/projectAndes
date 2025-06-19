import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportarBalance(remisiones) {
    // Definir las columnas igual que en la tabla, agregando 'Exportable'
    const headers = [
        'Fecha Recepción', 'Remisión', 'Registro de Aplicación', 'Productor', 'Especie', 'Predio', 'Código', 'Trazabilidad',
        'Canastas', 'Kg Bruto', 'Kg Neto', 'Peso Canastas', 'Índice de Conversión', 'Kg Magullada', 'Kg Rajado', 'Kg Botritis',
        '% Pérdida', 'Cajas Exportar', 'Cajas 12*100', 'Kg 12*100', 'Cajas Granel', 'Kg Granel', 'Exportable', 'Factura', 'Embarque'
    ];
    const rows = [];
    remisiones.forEach(row => {
        const embalajes = Array.isArray(row.embalajes) ? row.embalajes : [];
        if (embalajes.length > 0) {
            embalajes.forEach((emb, embIdx) => {
                // Solo en la primera subfila, agrega los datos generales de la remisión
                const base = embIdx === 0 ? [
                    row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : '',
                    row.numero,
                    row.registroAplicacion,
                    row.RemisionRelaciones?.[0]?.productor?.nombre || '',
                    row.RemisionRelaciones?.[0]?.fruta?.nombre || '',
                    row.RemisionRelaciones?.[0]?.finca?.nombre || '',
                    row.RemisionRelaciones?.[0]?.finca?.codigo || '',
                    row.RemisionRelaciones?.[0]?.Trazabilidad?.numero || '',
                    row.numeroCanastas,
                    row.brutoKg,
                    row.netoFrutaKg,
                    row.netoCanastas,
                    row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? (Number(row.brutoKg) / Number(row.netoFrutaKg)).toFixed(2) : '',
                    row.SeleccionRelacione?.Seleccion?.magullado || '',
                    row.SeleccionRelacione?.Seleccion?.rajado || '',
                    row.SeleccionRelacione?.Seleccion?.botritis || '',
                    (() => { const magullado = parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0; const rajado = parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0; const botritis = parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0; const neto = parseFloat(row.netoFrutaKg) || 0; if (neto === 0) return ''; return (((magullado + rajado + botritis) / neto) * 100).toFixed(2) + '%'; })(),
                    embalajes.reduce((acc, emb) => acc + (parseInt(emb.numeroDeCajas) || 0), 0)
                ] : Array(18).fill('');
                // Subfila: datos de embalaje
                rows.push([
                    ...base,
                    emb.tipoPresentacion?.nombre === '12*100' ? emb.numeroDeCajas : 0,
                    emb.tipoPresentacion?.nombre === '12*100' ? emb.kgEmpacado : 0,
                    emb.tipoPresentacion?.nombre === 'GRANEL' ? emb.numeroDeCajas : 0,
                    emb.tipoPresentacion?.nombre === 'GRANEL' ? emb.kgEmpacado : 0,
                    emb.exportable || '',
                    emb.embarque?.Factura?.numero || 'Sin factura',
                    emb.embarque?.numero || ''
                ]);
            });
        } else {
            // Si no hay embalajes, una sola fila normal
            rows.push([
                row.fechaRecepcion ? new Date(row.fechaRecepcion).toLocaleDateString() : '',
                row.numero,
                row.registroAplicacion,
                row.RemisionRelaciones?.[0]?.productor?.nombre || '',
                row.RemisionRelaciones?.[0]?.fruta?.nombre || '',
                row.RemisionRelaciones?.[0]?.finca?.nombre || '',
                row.RemisionRelaciones?.[0]?.finca?.codigo || '',
                row.RemisionRelaciones?.[0]?.Trazabilidad?.numero || '',
                row.numeroCanastas,
                row.brutoKg,
                row.netoFrutaKg,
                row.netoCanastas,
                row.brutoKg && row.netoFrutaKg && Number(row.netoFrutaKg) !== 0 ? (Number(row.brutoKg) / Number(row.netoFrutaKg)).toFixed(2) : '',
                row.SeleccionRelacione?.Seleccion?.magullado || '',
                row.SeleccionRelacione?.Seleccion?.rajado || '',
                row.SeleccionRelacione?.Seleccion?.botritis || '',
                (() => { const magullado = parseFloat(row.SeleccionRelacione?.Seleccion?.magullado) || 0; const rajado = parseFloat(row.SeleccionRelacione?.Seleccion?.rajado) || 0; const botritis = parseFloat(row.SeleccionRelacione?.Seleccion?.botritis) || 0; const neto = parseFloat(row.netoFrutaKg) || 0; if (neto === 0) return ''; return (((magullado + rajado + botritis) / neto) * 100).toFixed(2) + '%'; })(),
                0, 0, 0, 0, '', 'Sin factura', ''
            ]);
        }
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balance');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'balance.xlsx');
} 