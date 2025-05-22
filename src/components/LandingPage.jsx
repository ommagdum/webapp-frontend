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
      navigate('/home');
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

        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto mb-16">
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

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced Protection</h3>
          <p className="text-gray-600">Real-time scanning and analysis of incoming emails</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Filtering</h3>
          <p className="text-gray-600">AI-powered classification of spam and legitimate emails</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Learning System</h3>
          <p className="text-gray-600">Continuous improvement through user feedback</p>
        </div>
      </div>

      <div className='bg-white py-12 mb-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>Trust In Numbers</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <p className='text-4xl font-bold text-purple-600 mb-2'>99.9%</p>
              <p className='text-gray-600'>Accuracy</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-purple-600 mb-2'>24/7</p>
              <p className='text-gray-600'>Real-time Protection</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-purple-600 mb-2'>50M+</p>
              <p className='text-gray-600'>Emails Analysed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="font-medium">Made by Om Magdum</span>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/om-ml-engg" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-1">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/ommagdum" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-1">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;