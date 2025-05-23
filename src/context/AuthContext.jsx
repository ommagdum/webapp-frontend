import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token decoding function with validation and buffer time
  const decodeToken = useCallback((token) => {
    if (!token || typeof token !== 'string') return null;
    
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      
      if (!decoded || !decoded.exp) return null;
      
      // Add buffer time (5 minutes) to token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 300; // 5 minutes in seconds
      
      if (decoded.exp < currentTime + bufferTime) {
        console.warn('Token is near expiry or expired');
        return null;
      }
      
      return {
        roles: decoded.roles ? (Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles]) : [],
        id: decoded.sub,
        email: decoded.email,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }, []);

  // State for user and verification
  const [user, setUser] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  // Check if user is logged in
  const isLoggedIn = useMemo(() => {
    return !!user && user.exp * 1000 > Date.now();
  }, [user]);

  // Handle OAuth token from URL
  const handleOAuthToken = useCallback(async (token) => {
    try {
      if (!token) return null;
      
      // Save token to localStorage
      localStorage.setItem('jwt', token);
      
      // Decode the token to get user data
      const decodedUser = decodeToken(token);
      
      if (!decodedUser) {
        throw new Error('Failed to decode authentication token');
      }
      
      // Update state and notify other components
      setUser(decodedUser);
      window.dispatchEvent(new CustomEvent('authstatechange', { detail: decodedUser }));
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      
      return decodedUser;
    } catch (error) {
      console.error('OAuth token handling failed:', error);
      localStorage.removeItem('jwt');
      setUser(null);
      throw error;
    }
  }, [decodeToken, navigate]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Check for token in URL first (OAuth redirect)
      const tokenFromUrl = searchParams.get('token');
      
      if (tokenFromUrl) {
        // Remove token from URL
        window.history.replaceState({}, '', window.location.pathname);
        handleOAuthToken(tokenFromUrl);
        return;
      }
      
      // Check for token in localStorage
      const token = localStorage.getItem('jwt');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          setUser(decoded);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes from other tabs/windows
    const handleStorageChange = (event) => {
      // Only process storage events that modify the JWT
      if (event.key === 'jwt' || event.key === null) {
        const token = localStorage.getItem('jwt');
        if (!token) {
          setUser(null);
        } else {
          const decoded = decodeToken(token);
          if (decoded) {
            setUser(decoded);
          } else {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [decodeToken, handleOAuthToken]);

  // Login function
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
      
      // Save token to localStorage and update state
      localStorage.setItem('jwt', token);
      const decodedUser = decodeToken(token);
      
      if (!decodedUser) {
        throw new Error('Failed to decode authentication token');
      }
      
      // Update state and notify other components
      setUser(decodedUser);
      window.dispatchEvent(new CustomEvent('authstatechange', { detail: decodedUser }));
      
      return response;
      
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message;
    }
  };
  
  // Register function
  const register = async (formData) => {
    try {
      if (!formData?.email?.trim() || !formData?.password?.trim()) {
        throw new Error('Email and password are required');
      }
      
      const normalizedEmail = formData.email.trim().toLowerCase();

      const registrationData = {
        email: normalizedEmail,
        password: formData.password,
        name: formData.name || ''
      };
      
      const response = await authService.register(registrationData);
      
      // Handle auto-login after registration if token is returned
      if (response.token) {
        localStorage.setItem('jwt', response.token);
        const decodedUser = decodeToken(response.token);
        if (decodedUser) {
          setUser(decodedUser);
          window.dispatchEvent(new CustomEvent('authstatechange', { detail: decodedUser }));
        }
      } else if (response.verificationToken) {
        // Handle email verification flow
        setVerificationToken(response.verificationToken);
        setIsVerificationSent(true);
      }
      
      return response;
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  };

  const refreshUserFromToken = useCallback(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      return null;
    }

    const decodedUser = decodeToken(token);
    if (decodedUser?.exp * 1000 > Date.now()) {
      setUser(decodedUser);
      return decodedUser;
    } else {
      localStorage.removeItem('jwt');
      setUser(null);
      return null;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    // Notify other components about logout
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  // Create the context value with all the necessary functions and state
  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    refreshUserFromToken,
    isVerificationSent,
    verificationToken,
    isLoggedIn: !!user,
    decodeToken,
    handleOAuthToken // Expose for manual OAuth handling if needed
  }), [
    user,
    isVerificationSent,
    verificationToken,
    login,
    register,
    refreshUserFromToken,
    decodeToken,
    handleOAuthToken
  ]);

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