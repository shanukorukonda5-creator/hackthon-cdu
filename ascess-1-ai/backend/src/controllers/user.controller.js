import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, ApiError } from '../utils/response.js';
import { userQueries } from '../supabase/queries.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userQueries.findById(req.user.id);
  if (!user) {
    throw new ApiError(44, 'User profile not found.');
  }
  return ApiResponse.success(res, user, 'Profile details retrieved');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, avatarUrl } = req.body;
  const updated = await userQueries.updateProfile(req.user.id, {
    fullName,
    avatarUrl,
  });
  const sanitized = await userQueries.findById(req.user.id);
  return ApiResponse.success(res, sanitized, 'Profile updated successfully');
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await userQueries.findByIdWithPassword(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);

  await userQueries.updatePassword(req.user.id, newHash);
  return ApiResponse.success(res, null, 'Password changed successfully');
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await userQueries.deleteAccount(req.user.id);
  res.clearCookie('token');
  return ApiResponse.success(res, null, 'User account deleted successfully');
});
