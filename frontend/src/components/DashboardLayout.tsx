// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  PencilIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const items = [
  { to: '/dashboard',           label: 'Inicio',         icon: <HomeIcon className="h-5 w-5" /> },
  { to: '/dashboard/students',  label: 'Alumnos',        icon: <UserGroupIcon className="h-5 w-5" /> },
  { to: '/dashboard/subjects',  label: 'Materias',       icon: <BookOpenIcon className="h-5 w-5" /> },
  { to: '/dashboard/grades',    label: 'Calificaciones', icon: <PencilIcon className="h-5 w-5" /> },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();  // <-- importamos logout

  const handleLogout = () => {
    if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
      logout();           // <— limpia token + user del localStorage y contexto
      navigate('/login'); // <— te manda al login
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`flex flex-col bg-white border-r transition-all duration-200 ${
          open ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {open && <span className="text-xl font-bold">EduConexión</span>}
          <button onClick={() => setOpen(o => !o)}>
            {open
              ? <XMarkIcon className="h-6 w-6 text-gray-600" />
              : <Bars3Icon className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Nav + Logout */}
        <nav className="flex-1">
          {items.map(item => {
            const active = loc.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 m-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#c6ac8f] text-[#0a0908]'
                    : 'text-gray-700 hover:bg-gray-200'
                } ${!open && 'justify-center'}`}
              >
                {item.icon}
                {open && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}

          {/* Botón de Cerrar Sesión justo después */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 m-2 rounded-lg transition-colors text-red-600 hover:bg-red-100 ${
              !open && 'justify-center'
            }`}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {open && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="p-4 bg-white shadow">
          <h1 className="text-2xl font-semibold capitalize">
            {loc.pathname.split('/').filter(Boolean).pop() || 'dashboard'}
          </h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
