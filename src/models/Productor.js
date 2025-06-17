class Productor {
    constructor(id, nombre, codigo, id_finca) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.id_finca = id_finca;
    }

    static fromJSON(json) {
        return new Productor(
            json.id,
            json.nombre,
            json.codigo,
            json.id_finca
        );
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            codigo: this.codigo,
            id_finca: this.id_finca
        };
    }
}

export default Productor; 