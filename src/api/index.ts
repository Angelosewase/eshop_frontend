import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create a function to handle auth state changes
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    console.log('🔐 API Request - Auth status:', {
      hasToken: !!token,
      url: config.url,
      method: config.method
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Added token to request headers');
    } else {
      console.log('⚠️ No token available for request');
    }

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('🌐 API Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
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
    // Check for token in response headers or body
    const responseToken = response.headers['authorization'] ||
      (response.data && response.data.token);

    if (responseToken) {
      console.log('🔐 Found new token in response');
      localStorage.setItem('auth_token', responseToken);
    }

    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
        hasToken: !!responseToken,
        timestamp: new Date().toISOString(),
      });
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
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('🔐 Received 401 error - handling auth error');
      handleAuthError();
    }

    return Promise.reject(error);
  }
);

export default api; 