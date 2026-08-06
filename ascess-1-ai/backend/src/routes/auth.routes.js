import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { authenticateJwt } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.get('/me', authenticateJwt, getMe);
router.post('/logout', logout);

export default router;
