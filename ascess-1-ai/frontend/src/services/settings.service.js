import axiosInstance from '../utils/axiosInstance';

export const settingsService = {
  getSettings: () => axiosInstance.get('/settings'),
  updateSettings: (settingsData) => axiosInstance.put('/settings', settingsData),
};
