import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          // No token found, use logout function from AuthContext
          logout();
          return;
        }
        
        // Check if token is expired
        if (user && user.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (user.exp < currentTime) {
            // Token expired, use logout function from AuthContext
            logout();
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
      }
    };
    
    if (isLoggedIn) validateSession();
  }, [isLoggedIn, user, logout, navigate]);

  if (!isLoggedIn) {
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

  return children;
};

export default ProtectedRoute;