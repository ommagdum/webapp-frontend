import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [emailContent, setEmailContent] = useState(localStorage.getItem('tempEmailContent') || '');

  const handleContentChange = (e) => {
    const content = e.target.value;
    setEmailContent(content);
    localStorage.setItem('tempEmailContent', content);
  };

  const handleAnalyze = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="py-4 px-6 flex justify-end">
        {!isLoggedIn && (
          <>
            <button 
              onClick={() => navigate('/login')} 
              className="mr-4 text-gray-600 hover:text-gray-800 "
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg"
            >
              Sign Up
            </button>
          </>
        )}
        {isLoggedIn && (
          <button 
            onClick={() => navigate('/dashboard')} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Dashboard
          </button>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-20 text-center">
        <div className="inline-block bg-purple-600 text-white text-sm px-4 py-1 rounded-full mb-6">
          Powered by AI
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Intelligent Email Protection
        </h1>
        
        <p className="text-[18px] text-gray-600 mb-12 max-w-2xl mx-auto">
          Advanced spam detection powered by machine learning. Protect your inbox 
          from unwanted messages with real-time analysis.
        </p>

        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Analyze Your Email</h2>
          <textarea
            value={emailContent}
            onChange={handleContentChange}
            className="w-full p-4 border rounded-lg mb-4 min-h-[200px]"
            placeholder="Paste email content here..."
          />
          <button 
            onClick={handleAnalyze}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg"
          >
            {isLoggedIn ? 'Analyze Now' : 'Sign In to Analyze'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;