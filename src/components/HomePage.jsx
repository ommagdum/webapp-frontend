import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/api';

const HomePage = () => {
  const [emailContent, setEmailContent] = useState(localStorage.getItem('tempEmailContent') || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContentChange = (e) => {
    const content = e.target.value;
    setEmailContent(content);
    localStorage.setItem('tempEmailContent', content);
    // Clear previous results when content changes
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      setError('Please enter email content to analyze');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');
      
      const response = await predictionService.checkSpam(emailContent);
      console.log('API Response:', response);
      
      // Store the original content in the response for history display
      if (response && !response.originalContent) {
        response.originalContent = emailContent;
      }
      
      setResult(response);
      localStorage.setItem('tempEmailContent', emailContent);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze email. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewHistory = () => {
    // Navigate with refresh timestamp to reload history and stats
    navigate(`/dashboard?refresh=${Date.now()}`);
  };

  // Function to render analysis result
  const renderResult = () => {
    if (!result) return null;

    console.log('Rendering result:', result);
    
    // Check for nested data structure
    const data = result.data || result;
    
    // Backend returns prediction=1 for spam, 0 for not spam
    const prediction = data.prediction || data.data?.prediction;
    const isSpam = prediction === 1 || prediction === "1" || data.isSpam || data.spam || false;
    
    // Get probability from the correct field
    const probability = data.probability || data.data?.probability || data.confidence || data.score || 0;
    const confidence = probability * 100;
    
    return (
      <div className={`mt-6 p-6 rounded-lg ${isSpam ? 'bg-red-50' : 'bg-green-50'}`}>
        <div className="flex items-center mb-4">
          {isSpam ? (
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div>
            <h3 className={`text-xl font-bold ${isSpam ? 'text-red-700' : 'text-green-700'}`}>
              {isSpam ? 'Spam Detected' : 'Not Spam'}
            </h3>
            <p className="text-gray-600">
              Confidence: {confidence.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Analyze Another
          </button>
          <button
            onClick={handleViewHistory}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View History
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center pt-16 pb-12">
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
      </div>

      {/* Email Analysis Box */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Analyze Your Email</h2>
          
          {!result && (
            <>
              <textarea
                value={emailContent}
                onChange={handleContentChange}
                className="w-full p-4 border rounded-lg mb-4 min-h-[200px]"
                placeholder="Paste email content here..."
                disabled={isAnalyzing}
              />
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full py-3 rounded-lg transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg ${
                  isAnalyzing 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </>
          )}
          
          {renderResult()}
        </div>
      </div>

      {/* Feature Cards - These will be visible when scrolling down */}
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

      {/* Stats Section */}
      <div className="bg-white py-12 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trust in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">99.9%</p>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">24/7</p>
              <p className="text-gray-600">Real-time Protection</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">50M+</p>
              <p className="text-gray-600">Emails Analyzed</p>
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

export default HomePage;