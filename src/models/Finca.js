class Finca {
    constructor(id, nombre, codigo, id_lote, id_sert_ica) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.id_lote = id_lote;
        this.id_sert_ica = id_sert_ica;
    }

    static fromJSON(json) {
        return new Finca(
            json.id,
            json.nombre,
            json.codigo,
            json.id_lote,
            json.id_sert_ica
        );
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            codigo: this.codigo,
            id_lote: this.id_lote,
            id_sert_ica: this.id_sert_ica
        };
    }
}

export default Finca; 