import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
