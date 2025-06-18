import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Frutas from '../frutas/Frutas';
import TiposFruta from './TiposFruta';
import Presentaciones from './Presentaciones';
import Embarques from './Embarques';
import TiposFrutaPresentacion from './TiposFrutaPresentacion';
import TipoPresentaciones from './TipoPresentaciones';
import Facturas from './Facturas';

const Configuraciones = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuraciones</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link
                    to="/configuraciones/frutas"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Frutas</h2>
                    <p className="text-gray-500 mt-2">Gestionar tipos de frutas</p>
                </Link>

                <Link
                    to="/configuraciones/tipos-fruta"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Tipos de Fruta</h2>
                    <p className="text-gray-500 mt-2">Gestionar variedades de frutas</p>
                </Link>

                <Link
                    to="/configuraciones/presentaciones"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Presentaciones</h2>
                    <p className="text-gray-500 mt-2">Gestionar presentaciones de empaque</p>
                </Link>

                <Link
                    to="/configuraciones/embarques"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Embarques</h2>
                    <p className="text-gray-500 mt-2">Gestionar números de embarque</p>
                </Link>

                <Link
                    to="/configuraciones/tipos-fruta-presentacion"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Tipos de Fruta Presentación</h2>
                    <p className="text-gray-500 mt-2">Gestionar tipos de fruta por presentación</p>
                </Link>

                <Link
                    to="/configuraciones/facturas"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold text-gray-700">Facturas</h2>
                    <p className="text-gray-500 mt-2">Gestionar facturas</p>
                </Link>
            </div>

            <Routes>
                <Route path="frutas" element={<Frutas />} />
                <Route path="tipos-fruta" element={<TiposFruta />} />
                <Route path="presentaciones" element={<Presentaciones />} />
                <Route path="embarques" element={<Embarques />} />
                <Route path="tipos-fruta-presentacion" element={<TipoPresentaciones />} />
                <Route path="facturas" element={<Facturas />} />
            </Routes>
        </div>
    );
};

export default Configuraciones; 