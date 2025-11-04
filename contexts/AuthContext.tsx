import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Plan } from '../types';

// The User object available in the app state (no password)
interface User {
  name: string;
  email: string;
  plan: Plan;
}

// The user object as stored in our "database" (localStorage)
interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradePlan: (plan: Plan) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- "Database" Helper Functions ---
const USERS_STORAGE_KEY = 'users_db';

const getUsersFromStorage = (): StoredUser[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const saveUsersToStorage = (users: StoredUser[]) => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
};

// --- Password Hashing Simulation ---
// In a real app, use a robust library like bcrypt.
// Using Web Crypto API for a more realistic simulation.
const simpleHash = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUserJSON = localStorage.getItem('user');
      if (!storedUserJSON) return null;
      
      const storedUser = JSON.parse(storedUserJSON);
      // Gracefully handle older user objects that might not have a plan
      if (!storedUser.plan) {
        storedUser.plan = Plan.Free;
      }
      return storedUser;
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

  const register = async (name: string, email: string, password: string) => {
    const users = getUsersFromStorage();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const passwordHash = await simpleHash(password);
    // New users start on the Free plan
    const newUser: StoredUser = { name, email: email.toLowerCase(), passwordHash, plan: Plan.Free };
    
    users.push(newUser);
    saveUsersToStorage(users);
    
    // Automatically log in after registration
    const { passwordHash: _, ...userToSet } = newUser;
    setUser(userToSet);
  };
  
  const login = async (email: string, password: string) => {
    const users = getUsersFromStorage();
    const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!storedUser) {
        throw new Error("Invalid email or password.");
    }
    
    const passwordHash = await simpleHash(password);
    if (storedUser.passwordHash !== passwordHash) {
        throw new Error("Invalid email or password.");
    }

    // Set user state without the password hash, ensuring plan defaults to Free if missing
    const userToSet: User = { 
        name: storedUser.name, 
        email: storedUser.email, 
        plan: storedUser.plan || Plan.Free 
    };
    setUser(userToSet);
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = (plan: Plan) => {
    setUser(currentUser => {
      if (!currentUser) return null;

      // Also update the user's plan in the "database"
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
          users[userIndex].plan = plan;
          saveUsersToStorage(users);
      }

      return { ...currentUser, plan: plan };
    });
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, upgradePlan }}>
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
