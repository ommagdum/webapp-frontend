import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const OAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== 'string') return null;
      
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      
      if (!decoded || !decoded.exp) return null;
      
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
  };

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (isProcessing || !searchParams) return;
      
      setIsProcessing(true);
      setLoading(true);
      
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
    
        // Clear URL parameters IMMEDIATELY to prevent reprocessing
        window.history.replaceState({}, '', window.location.pathname);
    
        if (error) {
          setError(error);
          throw new Error(`OAuth error: ${error}`);
        }
    
        if (!token) {
          throw new Error('No token received from OAuth provider');
        }
    
        // Store the token
        localStorage.setItem('jwt', token);
        
        // Decode the token to get user data
        const decodedUser = decodeToken(token);
        
        if (!decodedUser) {
          throw new Error('Failed to decode authentication token');
        }
        
        // Update auth state immediately
        window.dispatchEvent(new CustomEvent('authstatechange', { 
          detail: decodedUser 
        }));
        
        // Store user data in localStorage for initial page load before context is ready
        localStorage.setItem('user', JSON.stringify(decodedUser));
        
        // Navigate to the intended destination or dashboard
        const redirectTo = location.state?.from?.pathname || '/dashboard';
        navigate(redirectTo, { 
          replace: true,
          state: { 
            from: location,
            message: 'Successfully logged in!',
            skipAuthCheck: true  // Skip auth check for this navigation
          }
        });
      } catch (err) {
        console.error('OAuth processing error:', err);
        setError(err.message || 'Failed to process authentication. Please try again.');
        // Redirect to login with error state
        navigate('/login', { 
          replace: true,
          state: { 
            error: error || 'Authentication failed. Please try again.'
          }
        });
      } finally {
        setLoading(false);
        setIsProcessing(false);
      }
    };
  
    processOAuthCallback();
  }, [searchParams, navigate, isProcessing, location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner 
              className="mx-auto"
              message="Authenticating..."
            />
          </div>
        ) : error ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-red-600">Authentication Failed</h2>
            <p className="text-gray-700">{error}</p>
            <div className="mt-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Back to Login
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OAuthRedirect;