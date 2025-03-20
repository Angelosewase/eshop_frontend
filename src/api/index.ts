import axios from 'axios';

const API_BASE_URL ='http://localhost:5000';

let handleAuthError: () => void = () => {
  console.warn('Auth error handler not set');
};

export const setAuthErrorHandler = (handler: () => void) => {
  handleAuthError = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const responseToken = response.headers['authorization'] ||
      (response.data && response.data.token);

    if (responseToken) {
      localStorage.setItem('auth_token', responseToken);
    }
    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      handleAuthError();
    }

    return Promise.reject(error);
  }
);

export default api; 