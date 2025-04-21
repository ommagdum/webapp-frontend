import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

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

  const googleLogin = async (credential) => {
    try {
      const response = await authService.googleLogin(credential);
      console.log('Google Auth response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        return response;
      } else {
        throw new Error('No token received from Google Auth');
      }
    } catch (error) {
      console.error('Google login error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  
  console.log('AuthContext state:', { isLoggedIn });


const register = async (email, password) => {
  try {
    // Send registration request
    const response = await authService.register({ email, password });
    
    // If we get here, the registration was successful
    // regardless of how the response is structured
    setIsVerificationSent(true);
    
    // Check if verificationToken is in the response (for development)
    if (response.data && response.data.verificationToken) {
      setVerificationToken(response.data.verificationToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      googleLogin,
      logout, 
      register, 
      isVerificationSent,
      verificationToken, 
      setIsVerificationSent, 
      verifyEmail
    }}>
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