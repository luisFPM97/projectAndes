class Embarque {
    constructor(id, numero) {
        this.id = id;
        this.numero = numero;
    }

    static fromJSON(json) {
        return new Embarque(
            json.id,
            json.numero
        );
    }

    toJSON() {
        return {
            id: this.id,
            numero: this.numero
        };
    }
}

export default Embarque; 