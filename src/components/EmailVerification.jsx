import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verifyUserEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.')
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again later.');
      }
    };

    verifyUserEmail();
  }, [location.search, verifyEmail]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Email Verification</h1>
          
          {status === 'verifying' && (
            <div className="mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-6">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-green-700 mb-6">{message}</p>
              <Link 
                to="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg"
              >
                Go to Login
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-6">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-6">{message}</p>
              <Link 
                to="/register" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transform transition duration-200 hover:-translate-y-1 shadow hover:shadow-lg"
              >
                Back to Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;