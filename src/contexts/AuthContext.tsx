import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  level: number;
  xp: number;
  rfxBalance: number;
  co2Saved: number;
  joinedAt: string;
  achievements: string[];
  referralCode: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Axios Interceptor for JWT
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('rfx_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const loadUserFromToken = async () => {
      const storedToken = localStorage.getItem('rfx_token');
      if (storedToken) {
        try {
          // Set the token in axios headers for this request
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get(`${API_BASE_URL}/user/profile`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to verify token or fetch user profile:', error);
          localStorage.removeItem('rfx_token');
          localStorage.removeItem('rfx_user'); // Also clear stale user data
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('rfx_token', token);
      localStorage.setItem('rfx_user', JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('rfx_token', token);
      localStorage.setItem('rfx_user', JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rfx_user');
    localStorage.removeItem('rfx_token');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('rfx_user', JSON.stringify(updatedUser));
      // In a real app, you'd also send this update to the backend
      // axios.patch(`${API_BASE_URL}/user/profile`, updates);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
