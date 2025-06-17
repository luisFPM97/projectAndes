// Productores
export const productores = [
    { id: 1, nombre: "Juan Pérez", codigo: "0001", id_finca: 1 },
    { id: 2, nombre: "María García", codigo: "0002", id_finca: 2 },
    { id: 3, nombre: "Carlos López", codigo: "0003", id_finca: 3 }
];

// Fincas
export const fincas = [
    { id: 1, nombre: "Finca La Esperanza", codigo: "001" },
    { id: 2, nombre: "Finca El Paraíso", codigo: "002" },
    { id: 3, nombre: "Finca San José", codigo: "003" }
];

// Lotes
export const lotes = [
    { id: 1, nombre: "Lote A", codigo: "01", id_finca: 1 },
    { id: 2, nombre: "Lote B", codigo: "01", id_finca: 1 },
    { id: 3, nombre: "Lote C", codigo: "01", id_finca: 2 },
    { id: 4, nombre: "Lote D", codigo: "01", id_finca: 3 }
];

// Tipos de Fruta
export const tipos_fruta = [
    { id: 1, nombre: "Uva", codigo: "UV" },
    { id: 2, nombre: "Manzana", codigo: "MZ" },
    { id: 3, nombre: "Pera", codigo: "PR" }
];

// Frutas
export const frutas = [
    { id: 1, nombre: "Uva Red Globe", codigo: "UV001", id_tipo_fruta: 1 },
    { id: 2, nombre: "Uva Thompson", codigo: "UV002", id_tipo_fruta: 1 },
    { id: 3, nombre: "Manzana Gala", codigo: "MZ001", id_tipo_fruta: 2 },
    { id: 4, nombre: "Pera Packham", codigo: "PR001", id_tipo_fruta: 3 }
];

// Certificaciones
export const certificaciones = [
    { 
        id: 1, 
        n_cert: "CERT001", 
        id_finca: 1, 
        fecha_emision: "2024-01-01", 
        fecha_vencimiento: "2024-12-31", 
        activo: true 
    },
    { 
        id: 2, 
        n_cert: "CERT002", 
        id_finca: 2, 
        fecha_emision: "2024-01-15", 
        fecha_vencimiento: "2024-12-31", 
        activo: true 
    }
];

// Presentaciones
export const presentaciones = [
    { id: 1, nombre: "Caja Exportación", codigo: "CE" },
    { id: 2, nombre: "Caja Nacional", codigo: "CN" },
    { id: 3, nombre: "Bandeja Exportación", codigo: "BE" }
];

// Tipos de Fruta Presentación
export const tipos_fruta_pres = [
    { id: 1, nombre: "Uva Exportación", kg_empacado: 5 },
    { id: 2, nombre: "Manzana Nacional", kg_empacado: 10 },
    { id: 3, nombre: "Pera Exportación", kg_empacado: 5 }
];

// Embarques
export const embarques = [
    { id: 1, numero: "EMB001" },
    { id: 2, numero: "EMB002" },
    { id: 3, numero: "EMB003" }
];

// Recepciones
export const recepciones = [
    {
        id: 1,
        n_entrada: "ENT001",
        fecha_cosecha: "2024-03-01",
        fecha_recepcion: "2024-03-02",
        id_productor: 1,
        id_finca: 1,
        id_lote: 1,
        id_tipo_fruta: 1,
        id_fruta: 1,
        kg_bruto: 1000,
        neto_canastas: 950,
        numero_canastas: 10,
        registro_ica: "000100101160",
        registro_aplicacion: "000100101160",
        peso_neto_fruta: 950,
        trazabilidad: "000100101160"
    },
    {
        id: 2,
        n_entrada: "ENT002",
        fecha_cosecha: "2024-03-03",
        fecha_recepcion: "2024-03-04",
        id_productor: 2,
        id_finca: 2,
        id_lote: 3,
        id_tipo_fruta: 2,
        id_fruta: 3,
        kg_bruto: 1500,
        neto_canastas: 1425,
        numero_canastas: 15,
        registro_ica: "000100101160",
        registro_aplicacion: "000100101160",
        peso_neto_fruta: 1425,
        trazabilidad: "P002-F002-L003-20240303"
    }
];

// Selecciones
export const selecciones = [
    {
        id: 1,
        id_recepcion: 1,
        fecha_seleccion: "2024-03-02",
        magullado: 5,
        rajado: 3,
        botritis: 2,
        exportable: 900
    },
    {
        id: 2,
        id_recepcion: 2,
        fecha_seleccion: "2024-03-04",
        porcentaje_magullado: 4,
        porcentaje_rajado: 2,
        porcentaje_botritis: 1,
        exportable: 1350
    }
];

// Embalajes
export const embalajes = [
    {
        id: 1,
        estiba: "EST001",
        id_recepcion: 1,
        id_embarque: 1,
        id_presentacion: 1,
        id_tipo_fruta_pres: 1,
        numero_cajas: 50,
        kg_empacado: 250,
        porcentaje_empacado: 26.32
    },
    {
        id: 2,
        estiba: "EST002",
        id_recepcion: 1,
        id_embarque: 1,
        id_presentacion: 1,
        id_tipo_fruta_pres: 1,
        numero_cajas: 40,
        kg_empacado: 200,
        porcentaje_empacado: 21.05
    },
    {
        id: 3,
        estiba: "EST003",
        id_recepcion: 2,
        id_embarque: 2,
        id_presentacion: 2,
        id_tipo_fruta_pres: 2,
        numero_cajas: 30,
        kg_empacado: 300,
        porcentaje_empacado: 22.22
    }
]; 