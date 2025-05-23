import { useAuth } from '../context/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  
  // Get token from localStorage
  const token = localStorage.getItem('jwt');
  
  // Check if token exists and is valid
  const isTokenValid = token && user && user.exp * 1000 > Date.now();
  
  // If no token or invalid token, redirect to login
  if (!token || !isTokenValid) {
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