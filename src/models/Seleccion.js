class Seleccion {
    constructor(id, id_recepcion, fecha_seleccion, magullado, rajado, botritis) {
        this.id = id;
        this.id_recepcion = id_recepcion;
        this.fecha_seleccion = fecha_seleccion;
        this.magullado = magullado;
        this.rajado = rajado;
        this.botritis = botritis;
    }

    static fromJSON(json) {
        return new Seleccion(
            json.id,
            json.id_recepcion,
            json.fecha_seleccion,
            json.magullado,
            json.rajado,
            json.botritis
        );
    }

    toJSON() {
        return {
            id: this.id,
            id_recepcion: this.id_recepcion,
            fecha_seleccion: this.fecha_seleccion,
            magullado: this.magullado,
            rajado: this.rajado,
            botritis: this.botritis
        };
    }
}

export default Seleccion; 