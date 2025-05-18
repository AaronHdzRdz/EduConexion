// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Si no hay usuario en contexto, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay user, deja pasar
  return <>{children}</>;
};

export default PrivateRoute;
