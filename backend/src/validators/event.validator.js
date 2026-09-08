import { z } from 'zod';

const eventFields = {
  title: z.string().trim().min(1).max(191),
  category: z.string().trim().min(1).max(191),
  description: z.string().trim().min(50),
  imageUrl: z.string().max(2048).nullable().optional().or(z.literal('')),
  eventDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  multiDay: z.coerce.boolean().optional(),
  endDate: z.string().nullable().optional().or(z.literal('')),
  recurring: z.coerce.boolean().optional(),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Annual']).nullable().optional().or(z.literal('')),
  registrationOpens: z.string().nullable().optional().or(z.literal('')),
  registrationCloses: z.string().nullable().optional().or(z.literal('')),
  templeId: z.coerce.number().int().positive().nullable().optional(),
  templeName: z.string().trim().min(1).max(191),
  hallName: z.string().max(191).nullable().optional().or(z.literal('')),
  address: z.string().max(191).nullable().optional().or(z.literal('')),
  mapsLink: z.string().url().max(2048).nullable().optional().or(z.literal('')),
  onlineLink: z.string().url().max(2048).nullable().optional().or(z.literal('')),
};

const eventObjectSchema = z.object(eventFields);

export const eventCreateSchema = eventObjectSchema.superRefine((event, context) => {
  if (event.multiDay && !event.endDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date is required for multi-day events' });
  }
});

export const eventUpdateSchema = eventObjectSchema.partial();

export const eventStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected', 'Cancelled', 'Completed']),
});
