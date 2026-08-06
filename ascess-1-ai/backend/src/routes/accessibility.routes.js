import { Router } from 'express';
import {
  getPreferences,
  updatePreferences,
  getProfile,
  updateProfile,
} from '../controllers/accessibility.controller.js';
import accessibilityAuditService from '../services/accessibilityAudit.service.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);

// Preferences & Profile Routes
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Audit & Scanner Endpoints
router.post('/audit', async (req, res, next) => {
  try {
    const data = await accessibilityAuditService.auditContent(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Audit generated successfully', data });
  } catch (err) {
    next(err);
  }
});

router.post('/website', async (req, res, next) => {
  try {
    const data = await accessibilityAuditService.auditWebsite(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Website audit generated successfully', data });
  } catch (err) {
    next(err);
  }
});

router.post('/document', async (req, res, next) => {
  try {
    const data = await accessibilityAuditService.auditDocument(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Document audit generated successfully', data });
  } catch (err) {
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const data = await accessibilityAuditService.getHistory(req.user.id);
    res.status(200).json({ success: true, message: 'Audit history retrieved', data });
  } catch (err) {
    next(err);
  }
});

router.get('/report/:id', async (req, res, next) => {
  try {
    const data = await accessibilityAuditService.getReportById(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Report retrieved', data });
  } catch (err) {
    next(err);
  }
});

// Export Routes
router.post('/export/markdown', async (req, res, next) => {
  try {
    const markdown = await accessibilityAuditService.exportReport(req.user.id, req.body.reportId, 'markdown');
    res.status(200).json({ success: true, message: 'Exported as Markdown', data: { markdown } });
  } catch (err) {
    next(err);
  }
});

router.post('/export/json', async (req, res, next) => {
  try {
    const json = await accessibilityAuditService.exportReport(req.user.id, req.body.reportId, 'json');
    res.status(200).json({ success: true, message: 'Exported as JSON', data: { json } });
  } catch (err) {
    next(err);
  }
});

router.post('/export/txt', async (req, res, next) => {
  try {
    const txt = await accessibilityAuditService.exportReport(req.user.id, req.body.reportId, 'txt');
    res.status(200).json({ success: true, message: 'Exported as TXT', data: { txt } });
  } catch (err) {
    next(err);
  }
});

router.post('/export/pdf', async (req, res, next) => {
  try {
    const pdfText = await accessibilityAuditService.exportReport(req.user.id, req.body.reportId, 'pdf');
    res.status(200).json({ success: true, message: 'Exported as PDF Text', data: { pdfText } });
  } catch (err) {
    next(err);
  }
});

export default router;
