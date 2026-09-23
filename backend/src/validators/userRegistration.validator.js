import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  mobile: z.string().trim().min(8, 'Mobile number is required').max(25, 'Mobile number is too long').regex(/^[+()\d\s-]+$/, 'Mobile number contains invalid characters'),
  mandirId: z.coerce.number().int('Temple is required').positive('Temple is required'),
  subscription: z.enum(['Yes', 'No']).default('No'),
  relationId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().positive().optional()
  ),
  termsAccepted: z.preprocess(
    val => (val === true || val === 'true' || val === 1 || val === '1'),
    z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms and Conditions to register as a devotee' })
    })
  ),
  termsAcceptedAt: z.string().optional().nullable(),
});

export const registrationStatusSchema = z.object({
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
});
