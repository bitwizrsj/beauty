import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const res = await AuthAPI.register({ name, email, password });
      const apiUser = res.data.user;
      const token = res.data.token;
      const mapped: User = { id: apiUser.id || apiUser._id, name: apiUser.name, email: apiUser.email, role: apiUser.role };
      setUser(mapped);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      localStorage.setItem(TOKEN_KEY, token);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await AuthAPI.login({ email, password });
      const apiUser = res.data.user;
      const token = res.data.token;
      const mapped: User = { id: apiUser.id || apiUser._id, name: apiUser.name, email: apiUser.email, role: apiUser.role };
      setUser(mapped);
      localStorage.setItem(USER_KEY, JSON.stringify(mapped));
      localStorage.setItem(TOKEN_KEY, token);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
