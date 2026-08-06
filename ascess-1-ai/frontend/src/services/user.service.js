import api from '../utils/api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  changePassword: (passwordData) => api.put('/user/change-password', passwordData),
  deleteAccount: () => api.delete('/user/delete-account'),
};

export default userService;
