import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: any }>;
  loginWithGoogle: () => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Fetch user profile to verify token is still valid
      authApi.getProfile()
        .then((profile) => {
          setUser(profile);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          setUser(null);
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const loginWithGoogle = async () => {
    // Google OAuth not implemented in this version
    return { error: { message: 'Google login not available in this version' } };
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    // Password reset not implemented in this version
    return { error: { message: 'Password reset not available in this version' } };
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    loginWithGoogle,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}