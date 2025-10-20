import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: string;
  pid: string;
  username: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      // Try to refresh token to check if user is still authenticated
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        withCredentials: true
      });
      
      if (response.status === 200 && response.data.accessToken) {
        // Token refreshed successfully, store the new access token
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      }
    } catch (error) {
      // Token refresh failed, clear user data
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      }, {
        withCredentials: true
      });

      const { user: userData } = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const isAuthenticated = !!user;
  
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
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


