import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Make sure we're sending the token exactly as stored
    config.headers.Authorization = `Bearer ${token.trim()}`;
    console.log('Sending token:', config.headers.Authorization); // Debug log
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response); // Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response:', response); 
      return response;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      console.log('Registration API response:', response);
      
      // Return the entire response, not just data
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      
      // If the error contains a message saying verification email was sent,
      // we should treat this as a success
      if (error.response?.data?.message?.includes('verification') || 
          error.response?.status === 201) {
        console.log('Registration successful but returned non-200 status');
        return {
          data: {
            message: 'Registration successful. Please verify your email.',
            verificationToken: error.response?.data?.verificationToken
          }
        };
      }
      
      throw error;
    }
  },
  
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/api/auth/verify?token=${token}`);
      console.log('Verification response:', response);
      return response;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
};

export const spamService = {
  checkEmail: async (content) => {
    try {
      const response = await api.post('/api/predict', { content });
      return response;
    } catch (error) {
      console.error('Spam check error:', error);
      throw error;
    }
  }
};



export default api;