import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spamService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmailForm from './EmailForm';
import ResultDisplay from './ResultDisplay';
import LoadingSpinner from './LoadingSpinner';

function SpamCheck() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedContent = localStorage.getItem('tempEmailContent');
    if (savedContent) {
      handleEmailCheck(savedContent);
      // Optional: clear the saved content after using it
      localStorage.removeItem('tempEmailContent');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');  
  };

  const handleEmailCheck = async (content) => {
    setIsLoading(true);
    setError('');
    
    // Debug logs
    console.log('Sending content:', content);
    console.log('Current token:', localStorage.getItem('token'));
    
    try {
      const response = await spamService.checkEmail(content);
      console.log('Spam check response:', response);
      setResult(response.data);
    } catch (err) {
      console.error('Spam check error:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please login again.');
        handleLogout();
      } else {
        setError(err.response?.data?.message || 'Failed to check email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="py-4 px-6 flex justify-end">
        <button 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-20 text-center">
        <div className="inline-block bg-purple-600 text-white text-sm px-4 py-1 rounded-full mb-6">
          Powered by AI
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Intelligent Email Protection
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Advanced spam detection powered by machine learning. Protect your inbox 
          from unwanted messages with real-time analysis.
        </p>

        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Analyze Your Email</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <EmailForm 
            onSubmit={handleEmailCheck}
            disabled={isLoading}
          />

          {isLoading && <LoadingSpinner />}
          
          {result && !isLoading && <ResultDisplay result={result} />}
        </div>
      </main>
    </div>
  );
}

export default SpamCheck;