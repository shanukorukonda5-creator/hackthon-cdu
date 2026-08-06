import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJwt);
router.get('/stats', getDashboardStats);

export default router;
