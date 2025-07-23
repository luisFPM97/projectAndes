import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, X, Home, Users, Landmark, Map, Apple, Clipboard, 
  PackageCheck, Package, Truck, LogOut, Bolt, FileText, BarChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Productores', path: '/productores', icon: <Users size={20} /> },
    //{ name: 'Fincas', path: '/fincas', icon: <Landmark size={20} /> },
    //{ name: 'Lotes', path: '/lotes', icon: <Map size={20} /> },
    { name: 'Configuraciones', path: '/configuraciones', icon: <Bolt size={20} /> },
    { name: 'GGN', path: '/ggn', icon: <Apple size={20} /> },
    { name: 'Certificados ICA', path: '/certificaciones', icon: <Clipboard size={20} /> },
    { name: 'Recepción', path: '/recepciones', icon: <PackageCheck size={20} /> },
    { name: 'Selección', path: '/selecciones', icon: <Package size={20} /> },
    { name: 'Embarque', path: '/embalajes', icon: <Truck size={20} /> },
    { name: 'Hoja de Vida', path: '/hoja-vida', icon: <FileText size={20} /> },
    { name: 'Balance de Masas', path: '/balance', icon: <BarChart size={20} /> },
  ];

  return (
    <>
    
      
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-green-600 text-white p-2 rounded-md"
      >
        <Menu size={24} />
      </button>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-green-700">AndesExport</h2>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors ${
                        isActive ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : ''
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
      
    
    
    </>
  );
};