import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthenticatedLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check current path to determine active link
  const isHomePage = location.pathname === '/home';
  const isDashboardPage = location.pathname === '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="py-4 px-6 flex justify-between items-center">
        {/* Left side - Main Navigation */}
        <div className="flex items-center space-x-2">
          <Link 
            to="/home" 
            className={`flex items-center space-x-1 ${isHomePage 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:text-purple-600'} px-4 py-2 rounded-lg`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center space-x-1 ${isDashboardPage 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:text-purple-600'} px-4 py-2 rounded-lg`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
        </div>
        
        {/* Right side - User Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2h10v10H4V5zm4 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;