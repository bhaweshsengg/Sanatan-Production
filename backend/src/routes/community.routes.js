import { Router } from 'express';
import {
  getDiscussions,
  createDiscussion,
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getMembers,
} from '../controllers/community.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

// Discussions
router.get('/discussions', getDiscussions);
router.post('/discussions', authenticate, createDiscussion);

// Local Groups
router.get('/groups', optionalAuthenticate, getGroups);
router.get('/groups/:id', optionalAuthenticate, getGroupById);
router.post('/groups', authenticate, createGroup);
router.put('/groups/:id', authenticate, updateGroup);
router.delete('/groups/:id', authenticate, deleteGroup);

// Group Membership Actions
router.post('/groups/:id/join', authenticate, joinGroup);
router.post('/groups/:id/leave', authenticate, leaveGroup);

// Community Members Directory
router.get('/members', getMembers);

export default router;
