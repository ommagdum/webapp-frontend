import { useEffect, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  
  // Get token from localStorage
  const token = localStorage.getItem('jwt');
  
  // Add buffer time (5 minutes) for token expiration check
  const isTokenValid = (exp) => {
    if (!exp) return false;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return (exp * 1000) > (currentTime + bufferTime);
  };

  useEffect(() => {
    const validateAuth = async () => {
      // Skip validation if we're already authenticated
      if (location.state?.skipAuthCheck) {
        setIsValidating(false);
        return;
      }

      // If no token, redirect to login
      if (!token) {
        navigate('/login', {
          state: { 
            from: location,
            message: 'Please log in to access this page'
          },
          replace: true
        });
        return;
      }

      // If we have a user object, check token validity
      if (user) {
        if (!isTokenValid(user.exp)) {
          // Token expired or invalid
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          navigate('/login', {
            state: { 
              from: location,
              message: 'Your session has expired. Please log in again.'
            },
            replace: true
          });
          return;
        }
      }
      
      setIsValidating(false);
    };

    validateAuth();
  }, [token, user, location, navigate]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If we have a token and it's valid, render children
  if (token && user && isTokenValid(user.exp)) {
    return children;
  }

  // Fallback redirect (should be caught by the useEffect, but just in case)
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
};

export default ProtectedRoute;