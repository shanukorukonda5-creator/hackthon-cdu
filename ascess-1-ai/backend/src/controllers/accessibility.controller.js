import { asyncHandler } from '../utils/asyncHandler.js';
import { accessibilityService } from '../services/accessibility.service.js';

const executeWithTiming = async (res, message, fn) => {
  const startTime = Date.now();
  const data = await fn();
  const processingTime = `${Date.now() - startTime}ms`;

  return res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    processingTime,
  });
};

export const getPreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Accessibility preferences retrieved', () =>
    accessibilityService.getPreferences(userId)
  );
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Accessibility preferences saved successfully', () =>
    accessibilityService.updatePreferences(userId, req.body)
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Accessibility profile retrieved', () =>
    accessibilityService.getProfile(userId)
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Accessibility profile updated', () =>
    accessibilityService.updateProfile(userId, req.body)
  );
});
