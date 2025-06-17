import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';

import { Fincas } from './views/entidades/Fincas';
import Productores from './modules/productores/Productores';
import Frutas from './modules/frutas/Frutas';
import Certificaciones from './modules/certificaciones/Certificaciones';
import Configuraciones from './modules/configuraciones/Configuraciones';
import Recepciones from './modules/recepciones/Recepciones';
import Selecciones from './modules/selecciones/Selecciones';
import Embalajes from './modules/embalajes/Embalajes';
import HojaVidaRemision from './modules/hojaVida/HojaVidaRemision';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={<Navigate to="/hoja-vida" replace />}
              />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productores" element={<Productores />} />
                <Route path="/fincas" element={<Fincas />} />
                <Route path="/lotes" element={<Recepciones />} />
                <Route path="/frutas" element={<Frutas />} />
                <Route path="/certificaciones" element={<Certificaciones />} />
                <Route path="/configuraciones/*" element={<Configuraciones />} />
                <Route path="/recepciones" element={<Recepciones />} />
                <Route path="/selecciones" element={<Selecciones />} />
                <Route path="/embalajes" element={<Embalajes />} />
                <Route path="/hoja-vida" element={<HojaVidaRemision />} />
                {/* Add more routes for other entities */}
              </Route>
              
              <Route path="*" element={<Navigate to="/hoja-vida" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;