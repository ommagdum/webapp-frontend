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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEmailCheck = async (content) => {
    setIsLoading(true);
    setError('');
    
    try {
        const response = await spamService.checkEmail(content);
        setResult(response.data);
        console.log('Response received:', response.data); // Debug log
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'Failed to check email');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Email Spam Detector
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>

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
    </div>
  );
}

export default SpamCheck;