import axios from 'axios';

// Base URLs for different services (bypassing gateway for now)
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:8080';
const BOOKING_BASE_URL = process.env.REACT_APP_BOOKING_URL || 'http://localhost:8081';
const PAYMENT_BASE_URL = process.env.REACT_APP_PAYMENT_URL || 'http://localhost:8083';
const NOTIFICATION_BASE_URL = process.env.REACT_APP_NOTIFICATION_URL || 'http://localhost:8084';

// Create axios instance with dynamic baseURL based on request path
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Set correct baseURL and add JWT token
api.interceptors.request.use(
  (config) => {
    // Determine baseURL based on the request path
    if (config.url.startsWith('/auth')) {
      config.baseURL = AUTH_BASE_URL;
    } else if (config.url.startsWith('/bookings')) {
      config.baseURL = BOOKING_BASE_URL;
    } else if (config.url.startsWith('/payments')) {
      config.baseURL = PAYMENT_BASE_URL;
    } else if (config.url.startsWith('/notifications')) {
      config.baseURL = NOTIFICATION_BASE_URL;
    } else {
      config.baseURL = AUTH_BASE_URL; // default to auth service
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
