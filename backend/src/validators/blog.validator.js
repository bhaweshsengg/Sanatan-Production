import { z } from 'zod';

const blogFields = {
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(191),
  category: z.string().trim().min(2, 'Category is required').max(191),
  excerpt: z.string().trim().min(10, 'Summary/excerpt must be at least 10 characters'),
  content: z.string().trim().min(20, 'Content must be at least 20 characters'),
  imageUrl: z.string().max(2048).nullable().optional().or(z.literal('')),
  authorName: z.string().trim().min(2, 'Author name is required').max(191),
  tags: z.string().nullable().optional().or(z.literal('')),
  readTime: z.string().nullable().optional().or(z.literal('')),
  status: z.enum(['Draft', 'Published', 'Archived']).optional().default('Draft'),
};

export const blogCreateSchema = z.object(blogFields);

export const blogUpdateSchema = z.object(blogFields).partial();

export const blogStatusSchema = z.object({
  status: z.enum(['Draft', 'Published', 'Archived']),
});
