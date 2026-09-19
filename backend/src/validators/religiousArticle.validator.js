import { z } from 'zod';

const articleCategoryEnum = z.enum([
  'Mantras',
  'Chalisas',
  'Stotrams',
  'Scriptures',
  'Philosophy',
  'Rituals',
  'General',
]);

const articleStatusEnum = z.enum(['Draft', 'Published', 'Archived']);

export const religiousArticleCreateSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(255),
  sanskritTitle: z.string().trim().max(255).optional().nullable(),
  category: articleCategoryEnum.default('Mantras'),
  deity: z.string().trim().max(100).optional().nullable(),
  source: z.string().trim().max(255).optional().nullable(),
  summary: z.string().trim().min(5, 'Summary must be at least 5 characters'),
  sanskritText: z.string().trim().optional().nullable(),
  transliteration: z.string().trim().optional().nullable(),
  englishMeaning: z.string().trim().optional().nullable(),
  significance: z.string().trim().optional().nullable(),
  bestTimeToChant: z.string().trim().max(191).optional().nullable(),
  verses: z.any().optional().nullable(),
  status: articleStatusEnum.default('Published'),
});

export const religiousArticleUpdateSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(255).optional(),
  sanskritTitle: z.string().trim().max(255).optional().nullable(),
  category: articleCategoryEnum.optional(),
  deity: z.string().trim().max(100).optional().nullable(),
  source: z.string().trim().max(255).optional().nullable(),
  summary: z.string().trim().min(5, 'Summary must be at least 5 characters').optional(),
  sanskritText: z.string().trim().optional().nullable(),
  transliteration: z.string().trim().optional().nullable(),
  englishMeaning: z.string().trim().optional().nullable(),
  significance: z.string().trim().optional().nullable(),
  bestTimeToChant: z.string().trim().max(191).optional().nullable(),
  verses: z.any().optional().nullable(),
  status: articleStatusEnum.optional(),
});

export const religiousArticleStatusSchema = z.object({
  status: articleStatusEnum,
});
