import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Please enter a valid email address'),
  mobile: z.string().trim().min(8, 'Mobile number is required').max(15, 'Mobile number is too long').regex(/^[+()\d\s-]+$/, 'Mobile number contains invalid characters'),
  relationId: z.coerce.number().int('Relation is required').positive('Relation is required'),
  mandirId: z.coerce.number().int('Mandir is required').positive('Mandir is required'),
});

export const registrationStatusSchema = z.object({
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});
