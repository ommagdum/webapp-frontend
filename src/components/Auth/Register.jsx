import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const { register, isVerificationSent, verificationToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setError('');
    setIsLoading(true);
  
    try {
      await register(formData.email, formData.password);
      // If we get here and no error was thrown, registration was successful
      // The isVerificationSent state in AuthContext will cause the verification UI to show
      console.log('Registration successful, verification email sent');
    } catch (err) {
      console.error('Registration error in component:', err);
      
      // Handle different error response formats
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
          <div className='text-center'>
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className='text-3xl font-bold'>Check Your Email</h1>
            <p className='mt-2 text-gray-600'>
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
          </div>
          
          {/* For development purposes only - remove in production */}
          {verificationToken && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Development Mode: Use this verification link:</p>
              <a 
                href={`/verify?token=${verificationToken}`}
                className="text-purple-600 hover:text-purple-500 text-sm underline break-all"
              >
                Verify your email
              </a>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Create an account</h1>
          <p className='mt-2 text-gray-600'>
            Join us to protect your inbox from spam
          </p>
        </div>

        {error && (
          <div className='bg-red-50 text-red-600 p-3 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div>
            <div className='relative'>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input 
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className='w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500'
              placeholder='Email'
              required
              />
            </div>
          </div>

          <div>
            <div className='relative'>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className='w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500'
              placeholder='Password'
              required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <button 
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
            isLoading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg`}
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </span>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-500">
              Sign in
            </Link>
          </p>
        
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
            Back to home
          </Link>
        </div>
      </div>
    </div>

  );
}

export default Register;
