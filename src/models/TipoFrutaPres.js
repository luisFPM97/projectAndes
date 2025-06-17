class TipoFrutaPres {
    constructor(id, nombre, kg_empacado) {
        this.id = id;
        this.nombre = nombre;
        this.kg_empacado = kg_empacado;
    }

    static fromJSON(json) {
        return new TipoFrutaPres(
            json.id,
            json.nombre,
            json.kg_empacado
        );
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            kg_empacado: this.kg_empacado
        };
    }
}

export default TipoFrutaPres; 