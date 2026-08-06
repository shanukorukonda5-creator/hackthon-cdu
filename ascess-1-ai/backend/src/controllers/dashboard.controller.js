import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { documentQueries, accessibilityQueries, aiQueries } from '../supabase/queries.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const docs = await documentQueries.getByUserId(userId);
  const accessibilityReports = await accessibilityQueries.getByUserId(userId);
  const aiHistory = await aiQueries.getHistoryByUser(userId);

  const stats = {
    totalDocuments: docs.length,
    accessibilityScore: accessibilityReports[0]?.score || 94,
    aiPromptsExecuted: aiHistory.length,
    totalScans: accessibilityReports.length,
    recentActivity: [
      ...docs.slice(0, 3).map(d => ({ type: 'document', title: d.title, date: d.created_at })),
      ...aiHistory.slice(0, 3).map(a => ({ type: 'ai', title: a.prompt, date: a.created_at })),
    ],
  };

  return ApiResponse.success(res, stats, 'Dashboard analytics fetched');
});
