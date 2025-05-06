import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshResponse = await authService.refreshToken();
        // // Handle different token response structures
        // const newToken = refreshResponse.accessToken || 
        //                  refreshResponse.token || 
        //                  refreshResponse.data?.accessToken || 
        //                  refreshResponse.data?.token;
        const { data } = await axios.post(
          `${api.baseURL}/api/auth/refresh-token`, 
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        if (!newToken) {
          throw new Error('Token refresh failed: No token in response');
        }
        
        localStorage.setItem('jwt', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('jwt');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  register: async (userData) => {
    try {
      console.log('Sending registration data:', userData);
      
      // Keep the request simple - just email and password
      const requestData = {
        email: userData.email,
        password: userData.password
      };
      
      const response = await api.post('/api/auth/register', requestData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error.response?.data || error.message);
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const response = await api.post('/api/auth/refresh-token', {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Session refresh failed');
    }
  },
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Decode token to check expiration
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token has expired');
      }
      
      return { valid: true, user: decoded };
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error(error.message || 'Token verification failed');
    }
  }
};

// Prediction Service
const predictionService = {
  checkSpam: async (emailText) => {
    try {
      // The backend expects 'content' instead of 'email'
      console.log('Sending to backend:', { content: emailText });
      const response = await api.post('/api/predict', { content: emailText });
      console.log('Spam check API Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Spam check failed');
    }
  },
  getHistory: async (page = 0, size = 10) => {
    try {
      // Get the user email from the JWT token
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Add a timestamp to prevent caching
      const timestamp = Date.now();
      
      // Include userId as a query parameter and add cache busting
      const response = await api.get(`/api/predictions/history?page=${page}&size=${size}&userId=${token}&_t=${timestamp}`);
      console.log('History API Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load history');
    }
  },
  
  submitFeedback: async (predictionId, correctedLabel) => {
  try {
    // Convert to backend's expected snake_case format
    const payload = {
      prediction_id: Number(predictionId),
      corrected_label: correctedLabel.toLowerCase().trim()
    };

    const response = await api.post('/api/feedback/correct-prediction', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Validation Failure:', error.response?.data);
    throw error;
  }
}
};

// Admin endpoints
const admin = {
  getModelVersions: () => api.get('/model/versions'),
  triggerRetraining: () => api.post('/retrain'),
  rollbackModel: (versionId) => api.post(`/model/rollback/${versionId}`)
};

// Stats Service
const statsService = {
  fetchStats: async () => {
    try {
      // Get the user token for authentication
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Add a timestamp to prevent caching
      const timestamp = Date.now();
      
      // Include userId as a query parameter and add cache busting
      const response = await api.get(`/api/stats?userId=${token}&_t=${timestamp}`);
      console.log('Stats API Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load stats');
    }
  }
};

// Export services
export { api, authService, predictionService, statsService, admin };
export default {
  api,
  authService,
  predictionService,
  statsService,
  admin
};