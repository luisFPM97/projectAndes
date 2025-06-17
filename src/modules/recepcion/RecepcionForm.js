import React, { useState, useEffect } from 'react';
import { create, update, getById } from '../../services/api';
import Productor from '../../models/Productor';
import Finca from '../../models/Finca';
import Lote from '../../models/Lote';
import CertIca from '../../models/CertIca';

const RecepcionForm = ({ recepcionId, onSave }) => {
    const [formData, setFormData] = useState({
        n_entrada: '',
        fecha_cosecha: '',
        fecha_recepcion: '',
        tipo_fruta: '',
        fruta: '',
        bruto_fruta: 0,
        neto_fruta: 0,
        n_canastas: 0,
        neto_canastas: 0,
        reg_aplicacion: 0,
        dev_puerta: 0,
        id_productor: '',
        id_finca: '',
        id_lote: '',
        id_cert_ica: ''
    });

    const [productores, setProductores] = useState([]);
    const [fincas, setFincas] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [certificados, setCertificados] = useState([]);

    useEffect(() => {
        loadData();
        if (recepcionId) {
            loadRecepcion();
        }
    }, [recepcionId]);

    const loadData = async () => {
        try {
            const [productoresData, fincasData, lotesData, certificadosData] = await Promise.all([
                getAll('productores'),
                getAll('fincas'),
                getAll('lotes'),
                getAll('certificados')
            ]);

            setProductores(productoresData.map(p => Productor.fromJSON(p)));
            setFincas(fincasData.map(f => Finca.fromJSON(f)));
            setLotes(lotesData.map(l => Lote.fromJSON(l)));
            setCertificados(certificadosData.map(c => CertIca.fromJSON(c)));
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    const loadRecepcion = async () => {
        try {
            const data = await getById('recepciones', recepcionId);
            setFormData(data);
        } catch (error) {
            console.error('Error cargando recepción:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (recepcionId) {
                await update('recepciones', recepcionId, formData);
            } else {
                await create('recepciones', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error guardando recepción:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Entrada</label>
                    <input
                        type="number"
                        name="n_entrada"
                        value={formData.n_entrada}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Cosecha</label>
                    <input
                        type="date"
                        name="fecha_cosecha"
                        value={formData.fecha_cosecha}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                {/* Agregar más campos según sea necesario */}
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {recepcionId ? 'Actualizar' : 'Crear'} Recepción
                </button>
            </div>
        </form>
    );
};

export default RecepcionForm; 