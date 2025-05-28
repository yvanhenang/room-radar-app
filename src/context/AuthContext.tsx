import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  users: User[];
  promoteToAdmin: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'Admin',
    role: 'admin'
  },
  {
    id: '2',
    name: 'User',
    email: 'Users',
    role: 'user'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Vérification des identifiants fixes
    if (username === 'Admin' && password === 'SkyEngPro_Admin') {
      const adminUser = users.find(u => u.role === 'admin');
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return;
      }
    } else if (username === 'Users' && password === 'SkyEngPro') {
      const normalUser = users.find(u => u.role === 'user');
      if (normalUser) {
        setUser(normalUser);
        localStorage.setItem('currentUser', JSON.stringify(normalUser));
        return;
      }
    }
    throw new Error('Identifiants invalides');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const promoteToAdmin = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, role: 'admin' } : u
      )
    );
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, users, promoteToAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 