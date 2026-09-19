import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required').optional(),
  username: z.string().trim().min(1, 'Username is required').optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.email || data.username, {
  message: 'Email address is required',
  path: ['email'],
});

export const logoutSchema = z.object({
  refresh: z.string().min(1, 'Refresh token is required'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full Name must be at least 2 characters').optional(),
  name: z.string().trim().min(2).optional(),
  username: z.string().trim().min(2).optional(),
  email: z.string().trim().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
}).refine(data => Boolean(data.fullName || data.name || data.username), {
  message: 'Full Name is required',
  path: ['fullName'],
});

