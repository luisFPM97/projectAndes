class Recepcion {
    constructor(id, n_entrada, fecha_cosecha, fecha_recepcion, tipo_fruta, fruta, 
                bruto_fruta, neto_fruta, n_canastas, neto_canastas, reg_aplicacion, 
                dev_puerta, id_productor, id_finca, id_lote, id_cert_ica) {
        this.id = id;
        this.n_entrada = n_entrada;
        this.fecha_cosecha = fecha_cosecha;
        this.fecha_recepcion = fecha_recepcion;
        this.tipo_fruta = tipo_fruta;
        this.fruta = fruta;
        this.bruto_fruta = bruto_fruta;
        this.neto_fruta = neto_fruta;
        this.n_canastas = n_canastas;
        this.neto_canastas = neto_canastas;
        this.reg_aplicacion = reg_aplicacion;
        this.dev_puerta = dev_puerta;
        this.id_productor = id_productor;
        this.id_finca = id_finca;
        this.id_lote = id_lote;
        this.id_cert_ica = id_cert_ica;
    }

    static fromJSON(json) {
        return new Recepcion(
            json.id,
            json.n_entrada,
            json.fecha_cosecha,
            json.fecha_recepcion,
            json.tipo_fruta,
            json.fruta,
            json.bruto_fruta,
            json.neto_fruta,
            json.n_canastas,
            json.neto_canastas,
            json.reg_aplicacion,
            json.dev_puerta,
            json.id_productor,
            json.id_finca,
            json.id_lote,
            json.id_cert_ica
        );
    }

    toJSON() {
        return {
            id: this.id,
            n_entrada: this.n_entrada,
            fecha_cosecha: this.fecha_cosecha,
            fecha_recepcion: this.fecha_recepcion,
            tipo_fruta: this.tipo_fruta,
            fruta: this.fruta,
            bruto_fruta: this.bruto_fruta,
            neto_fruta: this.neto_fruta,
            n_canastas: this.n_canastas,
            neto_canastas: this.neto_canastas,
            reg_aplicacion: this.reg_aplicacion,
            dev_puerta: this.dev_puerta,
            id_productor: this.id_productor,
            id_finca: this.id_finca,
            id_lote: this.id_lote,
            id_cert_ica: this.id_cert_ica
        };
    }
}

export default Recepcion; 