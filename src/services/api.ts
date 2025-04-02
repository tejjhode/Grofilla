import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tejas.yugal.tech',
  timeout: 10000, 
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');

        // Prevent multiple redirects if already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 500) {
        alert('Server error! Please try again later.');
      }
    } else if (error.request) {
      alert('Network error! Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default api;