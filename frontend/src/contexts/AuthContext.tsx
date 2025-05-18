// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthUser { id: number; name: string; email: string }
interface AuthContextProps {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Carga inicial directa desde localStorage
  const stored = localStorage.getItem('authUser');
  const [user, setUser] = useState<AuthUser | null>(
    stored ? JSON.parse(stored) : null
  );

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
