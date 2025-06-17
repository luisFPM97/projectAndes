class Embalaje {
    constructor(id, estiba, id_recepcion, id_embarque, id_presentacion, 
                id_tipo_fruta_pres, numero_cajas, kg_empacado, porcentaje_empacado) {
        this.id = id;
        this.estiba = estiba;
        this.id_recepcion = id_recepcion;
        this.id_embarque = id_embarque;
        this.id_presentacion = id_presentacion;
        this.id_tipo_fruta_pres = id_tipo_fruta_pres;
        this.numero_cajas = numero_cajas;
        this.kg_empacado = kg_empacado;
        this.porcentaje_empacado = porcentaje_empacado;
    }

    static fromJSON(json) {
        return new Embalaje(
            json.id,
            json.estiba,
            json.id_recepcion,
            json.id_embarque,
            json.id_presentacion,
            json.id_tipo_fruta_pres,
            json.numero_cajas,
            json.kg_empacado,
            json.porcentaje_empacado
        );
    }

    toJSON() {
        return {
            id: this.id,
            estiba: this.estiba,
            id_recepcion: this.id_recepcion,
            id_embarque: this.id_embarque,
            id_presentacion: this.id_presentacion,
            id_tipo_fruta_pres: this.id_tipo_fruta_pres,
            numero_cajas: this.numero_cajas,
            kg_empacado: this.kg_empacado,
            porcentaje_empacado: this.porcentaje_empacado
        };
    }
}

export default Embalaje; 