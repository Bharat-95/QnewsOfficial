import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for the context
interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  login: (role: string) => void;
  logout: () => Promise<void>;
}

// Provide a default value that matches the context type
const defaultContextValue: AuthContextType = {
  isLoggedIn: false,
  role: null,
  login: () => {},
  logout: async () => {},
};

// Create the AuthContext with the default value
const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');
        if (token) {
          setIsLoggedIn(true);
          setRole(storedRole);
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, []);

  const login = (role: string) => {
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
