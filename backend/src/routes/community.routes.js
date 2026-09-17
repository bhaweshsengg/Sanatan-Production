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
router.post('/groups', optionalAuthenticate, createGroup);
router.put('/groups/:id', optionalAuthenticate, updateGroup);
router.delete('/groups/:id', optionalAuthenticate, deleteGroup);

// Group Membership Actions
router.post('/groups/:id/join', optionalAuthenticate, joinGroup);
router.post('/groups/:id/leave', optionalAuthenticate, leaveGroup);

// Community Members Directory
router.get('/members', getMembers);

export default router;
