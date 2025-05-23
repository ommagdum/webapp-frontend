import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const OAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (isProcessing || !searchParams) return;
      
      setIsProcessing(true);
      setLoading(true);
      
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      // Handle errors from backend
      if (error) {
        console.error('OAuth Error:', error);
        setError(error || 'Authentication failed');
        navigate('/login', { state: { error }, replace: true });
        return;
      }

      // Validate token format (simple example)
      if (!token || !token.split('.').length === 3) {
        setError('Invalid token format');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Store token and update auth state
        localStorage.setItem('jwt', token);
        
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
        
        // Update auth context
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to intended route
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
      } catch (err) {
        console.error('OAuth processing error:', err);
        setError('Authentication failed');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, isProcessing, location.state]);

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