import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user, logout, refreshUserFromToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = localStorage.getItem('jwt');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          logout();
          return false;
        }
        
        // If we have a token but user state isn't updated yet, try to refresh it
        if (!isLoggedIn) {
          console.log('Token exists but user not logged in, refreshing user state');
          await refreshUserFromToken();
          return true;
        }
        
        // Check if token is expired
        if (user?.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          const bufferTime = 300; // 5 minutes buffer
          
          if (user.exp < currentTime + bufferTime) {
            console.log('Token expired or expiring soon, logging out');
            logout();
            return false;
          }
        }
        
        return true;
      } catch (error) {
        console.error('Session validation error:', error);
        logout();
        return false;
      } finally {
        setIsValidating(false);
      }
    };

    // Only validate if we're not already in the middle of validation
    if (isValidating) {
      validateSession();
    }
    
    // Listen for storage events to handle token updates from OAuth flow
    const handleStorageChange = async () => {
      if (localStorage.getItem('jwt')) {
        await refreshUserFromToken();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn, user, logout, navigate, refreshUserFromToken, isValidating]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    // Don't redirect if we're already on the login page to prevent loops
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            message: 'Please log in to access this page' 
          }} 
          replace 
        />
      );
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;