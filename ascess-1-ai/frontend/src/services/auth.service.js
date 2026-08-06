import api from '../utils/api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res;
  },
  getMe: () => api.get('/auth/me'),
  logout: async () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
};

export default authService;
