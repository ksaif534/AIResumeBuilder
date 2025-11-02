import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Plan } from '../types';

interface User {
  name: string;
  email: string;
  plan?: Plan;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  upgradePlan: (plan: Plan) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error("Failed to update localStorage with user data", error);
    }
  }, [user]);

  const login = (email: string, name: string = 'User') => {
    // When a new user logs in, they don't have a plan yet.
    const newUser: User = { name, email, plan: user?.plan };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = (plan: Plan) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, plan: plan };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};