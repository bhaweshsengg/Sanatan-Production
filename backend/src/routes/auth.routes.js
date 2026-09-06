import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, refresh, register, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, logoutSchema } from '../validators/auth.validator.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
});

router.post('/register', register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', validate(logoutSchema), logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
