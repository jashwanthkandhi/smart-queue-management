import React, { createContext, useState, useContext, ReactNode } from 'react';

export type UserRole = 'customer' | 'admin' | null;

interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem('userRole');
    return (stored as UserRole) || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (newRole: UserRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', newRole || '');
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
