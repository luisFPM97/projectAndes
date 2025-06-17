class Presentacion {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    static fromJSON(json) {
        return new Presentacion(
            json.id,
            json.nombre
        );
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre
        };
    }
}

export default Presentacion; 