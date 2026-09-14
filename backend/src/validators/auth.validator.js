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
