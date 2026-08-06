import axiosInstance from '../utils/axiosInstance';

export const dashboardService = {
  getStats: () => axiosInstance.get('/dashboard/stats'),
};
