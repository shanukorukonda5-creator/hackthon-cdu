import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { aiQueries, logQueries } from '../supabase/queries.js';

export const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const aiHistory = await aiQueries.getHistoryByUser(userId);
  const activityLogs = await logQueries.getByUserId(userId);

  return ApiResponse.success(res, { aiHistory, activityLogs }, 'History records retrieved');
});
