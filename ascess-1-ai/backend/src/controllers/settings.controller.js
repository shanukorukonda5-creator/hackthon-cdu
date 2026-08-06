import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { settingsQueries } from '../supabase/queries.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsQueries.getByUserId(req.user.id);
  return ApiResponse.success(res, settings || { theme: 'dark', fontSize: 'medium' }, 'User settings');
});

export const updateSettings = asyncHandler(async (req, res) => {
  const updated = await settingsQueries.upsert(req.user.id, req.body);
  return ApiResponse.success(res, updated, 'Settings updated successfully');
});
