import { asyncHandler } from '../utils/asyncHandler.js';
import { documentService } from '../services/document.service.js';

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

export const uploadFile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Document uploaded and processed successfully', () =>
    documentService.uploadFile(userId, req.file)
  );
});

export const processUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Website content scraped and processed successfully', () =>
    documentService.processUrl(userId, req.body.url)
  );
});

export const processText = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Text document processed successfully', () =>
    documentService.processText(userId, req.body.text, req.body.title)
  );
});

export const getDocuments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Documents retrieved successfully', () =>
    documentService.getUserDocuments(userId)
  );
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Document details retrieved', () =>
    documentService.getDocumentById(userId, req.params.id)
  );
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Document deleted successfully', () =>
    documentService.deleteDocument(userId, req.params.id)
  );
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Document favorite toggled', () =>
    documentService.toggleFavorite(userId, req.params.id)
  );
});

export const getContext = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  return executeWithTiming(res, 'Document context prepared for AI', () =>
    documentService.buildContext(userId, req.body.documentId)
  );
});
