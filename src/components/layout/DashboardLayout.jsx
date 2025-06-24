import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-2 lg:p-0 overflow-y-auto ml-0 lg:ml-32">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};