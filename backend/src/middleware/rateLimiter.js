import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const isDevOrTest = () => env.nodeEnv === 'development' || env.nodeEnv === 'test';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    status: 429,
    message: 'Too many login attempts, please try again after 15 minutes.',
    data: {},
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrTest,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    status: 429,
    message: 'Too many registration attempts from this IP, please try again after an hour.',
    data: {},
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrTest,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    status: 429,
    message: 'Too many password reset requests, please try again after 15 minutes.',
    data: {},
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrTest,
});

export const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    status: 429,
    message: 'Too many appointment requests, please try again later.',
    data: {},
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrTest,
});
