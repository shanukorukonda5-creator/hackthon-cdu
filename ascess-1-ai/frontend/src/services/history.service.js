import axiosInstance from '../utils/axiosInstance';

export const historyService = {
  getHistory: () => axiosInstance.get('/history'),
};

export const settingsService = {
  getSettings: () => axiosInstance.get('/settings'),
  updateSettings: (settingsData) => axiosInstance.put('/settings', settingsData),
};

export const dashboardService = {
  getStats: () => axiosInstance.get('/dashboard/stats'),
};
