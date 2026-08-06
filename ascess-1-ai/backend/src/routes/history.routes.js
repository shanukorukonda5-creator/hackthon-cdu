import { Router } from 'express';
import { getHistory } from '../controllers/history.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);
router.get('/', getHistory);

export default router;
