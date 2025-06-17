class CertIca {
    constructor(id, n_cert) {
        this.id = id;
        this.n_cert = n_cert;
    }

    static fromJSON(json) {
        return new CertIca(
            json.id,
            json.n_cert
        );
    }

    toJSON() {
        return {
            id: this.id,
            n_cert: this.n_cert
        };
    }
}

export default CertIca; 