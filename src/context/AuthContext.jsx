import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  
  // Define decodeToken FIRST to avoid initialization issues
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      return {
        roles: decoded.roles ? 
        (Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles]) 
        : [],
        id: decoded.sub,
        email: decoded.email,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  };

  // Now safely use decodeToken in initial state
  const refreshUserFromToken = () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const decoded = decodeToken(token);
      if (decoded.exp * 1000 > Date.now()) {
        const userData = {
          ...decoded,
          roles: Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles].filter(Boolean)
        };
        setUser(userData);
        return userData;
      } else {
        localStorage.removeItem('jwt');
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing user from token:', error);
      localStorage.removeItem('jwt');
      setUser(null);
      return null;
    }
  };

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('jwt');
    return token ? decodeToken(token) : null;
  });
  
  // Add state for verification tracking
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  // Initialize user state from token on mount
  useEffect(() => {
    refreshUserFromToken();
  }, []);
  const login = async (credentials) => {
    try {
      if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
        throw new Error('Email and password are required');
      }
  
      const normalizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password.trim()
      };
  
      const response = await authService.login(normalizedCredentials);
      
      // Check if response contains token directly or nested in data property
      const token = response.token || response.data?.token;
      
      if (!token) {
        console.error('Authentication failed: Token not found in response', response);
        throw new Error('Authentication failed: Invalid server response');
      }
      
      // Save token to localStorage
      localStorage.setItem('jwt', token);
      
      // Decode token and set user state
      const decodedUser = decodeToken(token);
      console.log('Login roles:', decodedUser.roles); // Debug logging
      setUser(decodedUser);
      
      return decodedUser;
  
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message;
    }
  };
  
  // Add register function
  const register = async (formData) => {
    try {
      if (!formData?.email?.trim() || !formData?.password?.trim()) {
        throw new Error('Email and password are required');
      }
      
      const normalizedEmail = formData.email.trim().toLowerCase();
      
      // Keep it simple - just email and password
      const registrationData = {
        email: normalizedEmail,
        password: formData.password
      };
      
      console.log('Sending registration data:', registrationData);
      
      const response = await authService.register(registrationData);
      
      // For development purposes, store verification token if provided
      if (response.verificationToken) {
        setVerificationToken(response.verificationToken);
      }
      
      setIsVerificationSent(true);
      return response;
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    refreshUserFromToken,
    isVerificationSent,
    verificationToken,
    isLoggedIn: !!user
  }), [user, isVerificationSent, verificationToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};