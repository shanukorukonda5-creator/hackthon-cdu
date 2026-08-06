import { asyncHandler } from '../utils/asyncHandler.js';
import { aiService } from '../services/ai.service.js';

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

export const chat = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'AI Chat response generated successfully', () =>
    aiService.chat(userId, req.body)
  );
});

export const simplify = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Text simplified successfully', () =>
    aiService.simplifyText(userId, req.body)
  );
});

export const translate = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Translation completed successfully', () =>
    aiService.translate(userId, req.body)
  );
});

export const analyze = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Accessibility analysis generated successfully', () =>
    aiService.analyzeAccessibility(userId, req.body)
  );
});

export const summarize = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Document summarized successfully', () =>
    aiService.summarizeDocument(userId, req.body)
  );
});

export const altText = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Alt text generated successfully', () =>
    aiService.generateAltText(userId, req.body)
  );
});

export const ocrClean = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'OCR text cleaned successfully', () =>
    aiService.cleanOcr(userId, req.body)
  );
});

export const accessibilityReport = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Website accessibility report generated', () =>
    aiService.generateWebsiteReport(userId, req.body)
  );
});

export const readingAssistant = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  return executeWithTiming(res, 'Reading assistant response generated', () =>
    aiService.askReadingAssistant(userId, req.body)
  );
});
