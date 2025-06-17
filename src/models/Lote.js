class Lote {
    constructor(id, codigo, id_tipo_fruta, id_fruta) {
        this.id = id;
        this.codigo = codigo;
        this.id_tipo_fruta = id_tipo_fruta;
        this.id_fruta = id_fruta;
    }

    static fromJSON(json) {
        return new Lote(
            json.id,
            json.codigo,
            json.id_tipo_fruta,
            json.id_fruta
        );
    }

    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            id_tipo_fruta: this.id_tipo_fruta,
            id_fruta: this.id_fruta
        };
    }
}

export default Lote; 