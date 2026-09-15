import { z } from 'zod';

export const templeStatusSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Delist', 'Reject', 'Rejected'])
    .transform(status => status === 'Reject' ? 'Rejected' : status),
});

export const templeCreateSchema = z.object({
  mandir_name: z.string().min(1),
  full_address: z.string().min(1),
  city_id: z.coerce.number().int().positive(),
  year_established: z.coerce.number().int().positive().optional(),
  main_deity_id: z.coerce.number().int().positive(),
  description: z.string().min(1),
  phone_no: z.string().min(1),
  email: z.string().optional().or(z.literal('')).nullable().transform(val => (val === undefined || val === null ? val : String(val).trim())),
  website: z.string().optional().or(z.literal('')).nullable().transform(val => (val === undefined || val === null ? val : String(val).trim())),
  opening_hours: z.string().min(1),
  service_offered: z.union([z.array(z.string()), z.string()]).optional(),
  facilities_offered: z.union([z.array(z.string()), z.string()]).optional(),
  your_name: z.string().min(1),
  your_email: z.string().optional().or(z.literal('')).nullable().transform(val => (val === undefined || val === null ? val : String(val).trim())),
  rating: z.coerce.number().min(0).max(5).optional(),
  location: z.string().min(1),
  status: z.enum(['Pending', 'Approved', 'Delist', 'Rejected']).optional(),
  role: z.string().optional(),
  contactRole: z.string().optional(),
  review: z.string().optional(),
  existing_images: z.union([z.array(z.string()), z.string()]).optional(),
});

export const templeUpdateSchema = templeCreateSchema.partial();