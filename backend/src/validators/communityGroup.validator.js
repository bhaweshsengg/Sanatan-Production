import { z } from 'zod';

const groupFields = {
  name: z.string().trim().min(3, 'Group name must be at least 3 characters').max(191),
  category: z.string().trim().min(2, 'Category is required').max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  cityName: z.string().trim().max(191).nullable().optional().or(z.literal('')),
  cityId: z.coerce.number().int().positive().nullable().optional(),
  meetingInfo: z.string().trim().max(191).nullable().optional().or(z.literal('')),
  contactEmail: z.string().trim().email('Valid email required').nullable().optional().or(z.literal('')),
  contactPhone: z.string().trim().max(50).nullable().optional().or(z.literal('')),
  imageUrl: z.string().trim().max(2048).nullable().optional().or(z.literal('')),
  creatorName: z.string().trim().max(191).nullable().optional().or(z.literal('')),
};

export const createGroupSchema = z.object(groupFields);

export const updateGroupSchema = z.object({
  ...groupFields,
  status: z.enum(['Active', 'Pending', 'Archived']).optional(),
}).partial();

export const joinGroupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(191),
  email: z.string().trim().email('Valid email required').max(191),
  phone: z.string().trim().max(50).nullable().optional().or(z.literal('')),
  role: z.string().trim().max(50).default('Member'),
});
