import axios from 'axios';
import env from '../config/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Network request failed.';

    if (status === 401) {
      // Auto cleanup expired token and redirect to login if not already on auth page
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login?expired=true';
      }
    }

    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors || null,
    });
  }
);

export default api;
