import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { authState } = useAuth();
  
  // Immediate role check without loading state
  const isAdmin = authState?.roles?.includes('ADMIN');
  
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;