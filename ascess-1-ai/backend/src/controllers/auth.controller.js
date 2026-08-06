import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { userQueries } from '../supabase/queries.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;
  const result = await registerUser({ email, password, fullName });
  
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, result, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, result, 'Logged in successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await userQueries.findById(req.user.id);
  return ApiResponse.success(res, user, 'User profile fetched successfully');
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  return ApiResponse.success(res, null, 'Logged out successfully');
});
