import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirect = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');
    
    console.log('OAuth redirect received. Token exists:', !!token);
    
    if (errorParam) {
      setError(errorParam);
      setLoading(false);
      return;
    }
    
    if (token) {
      console.log('Storing token and redirecting');
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      console.log('No token found in URL');
      setError('No authentication token received');
      setLoading(false);
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <>
            <div className="flex justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Authenticating...</h2>
            <p className="text-gray-600">You'll be redirected shortly</p>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mx-auto">
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
        )}
      </div>
    </div>
  );
};

export default OAuthRedirect; 