import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/user.controller.js';
import { authenticateJwt } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from '../validations/user.validation.js';

const router = Router();

router.use(authenticateJwt);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/change-password', validateRequest(changePasswordSchema), changePassword);
router.delete('/delete-account', deleteAccount);

export default router;
