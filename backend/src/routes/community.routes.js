import { Router } from 'express';
import { getDiscussions, createDiscussion } from '../controllers/community.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/discussions', getDiscussions);

// Protected routes
router.post('/discussions', authenticate, createDiscussion);

export default router;
