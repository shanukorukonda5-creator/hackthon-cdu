import { Router } from 'express';
import {
  chat,
  simplify,
  translate,
  analyze,
  summarize,
  altText,
  ocrClean,
  accessibilityReport,
  readingAssistant,
} from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  chatSchema,
  simplifySchema,
  translateSchema,
  analyzeSchema,
  summarizeSchema,
  altTextSchema,
  ocrCleanSchema,
  accessibilityReportSchema,
  readingAssistantSchema,
} from '../validations/ai.validation.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to protect AI routes
router.use(authenticateJwt);

router.post('/chat', validateRequest(chatSchema), chat);
router.post('/simplify', validateRequest(simplifySchema), simplify);
router.post('/translate', validateRequest(translateSchema), translate);
router.post('/analyze', validateRequest(analyzeSchema), analyze);
router.post('/summarize', validateRequest(summarizeSchema), summarize);
router.post('/alt-text', validateRequest(altTextSchema), altText);
router.post('/ocr-clean', validateRequest(ocrCleanSchema), ocrClean);
router.post('/accessibility-report', validateRequest(accessibilityReportSchema), accessibilityReport);
router.post('/reading-assistant', validateRequest(readingAssistantSchema), readingAssistant);

export default router;
