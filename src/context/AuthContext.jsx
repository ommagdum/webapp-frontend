import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      console.log('Auth response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        return response;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Add this console log to debug
  console.log('AuthContext state:', { isLoggedIn });

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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