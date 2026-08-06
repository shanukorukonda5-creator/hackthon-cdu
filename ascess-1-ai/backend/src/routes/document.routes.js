import { Router } from 'express';
import {
  uploadFile,
  processUrl,
  processText,
  getDocuments,
  getDocumentById,
  deleteDocument,
  toggleFavorite,
  getContext,
} from '../controllers/document.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { validateRequest } from '../middleware/validate.js';
import { urlScanSchema, textUploadSchema, contextSchema } from '../validations/document.validation.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

router.post('/upload', uploadMiddleware.single('file'), uploadFile);
router.post('/url', validateRequest(urlScanSchema), processUrl);
router.post('/text', validateRequest(textUploadSchema), processText);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.post('/favorite/:id', toggleFavorite);
router.post('/context', validateRequest(contextSchema), getContext);

export default router;
