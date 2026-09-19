import { Router } from 'express';
import {
  listPublicReligiousArticles,
  getPublicReligiousArticleById,
  listAdminReligiousArticles,
  getAdminReligiousArticleById,
  createReligiousArticle,
  updateReligiousArticle,
  updateReligiousArticleStatus,
  deleteReligiousArticle,
} from '../controllers/religiousArticle.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  religiousArticleCreateSchema,
  religiousArticleUpdateSchema,
  religiousArticleStatusSchema,
} from '../validators/religiousArticle.validator.js';

const router = Router();

// Public routes
router.get('/', listPublicReligiousArticles);
router.get('/admin', authenticate, authorize('Admin'), listAdminReligiousArticles);
router.get('/admin/:id', authenticate, authorize('Admin'), getAdminReligiousArticleById);
router.get('/:id', getPublicReligiousArticleById);

// Admin protected routes
router.post('/', authenticate, authorize('Admin'), validate(religiousArticleCreateSchema), createReligiousArticle);
router.put('/:id', authenticate, authorize('Admin'), validate(religiousArticleUpdateSchema), updateReligiousArticle);
router.patch('/:id/status', authenticate, authorize('Admin'), validate(religiousArticleStatusSchema), updateReligiousArticleStatus);
router.delete('/:id', authenticate, authorize('Admin'), deleteReligiousArticle);

export default router;
