import { Router } from 'express';
import {
  createEvent,
  getAdminEvent,
  getAdminEvents,
  listApprovedEvents,
  updateEvent,
  updateEventStatus,
} from '../controllers/event.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { eventCreateSchema, eventStatusSchema, eventUpdateSchema } from '../validators/event.validator.js';

const router = Router();

router.get('/', listApprovedEvents);
router.get('/admin', authenticate, authorize('Admin'), getAdminEvents);
router.get('/admin/:id', authenticate, authorize('Admin'), getAdminEvent);
router.post('/', validate(eventCreateSchema), (req, res, next) => {
  if (!req.headers.authorization) {
    return createEvent(req, res);
  }
  return authenticate(req, res, next);
}, createEvent);
router.put('/:id', authenticate, authorize('Admin'), validate(eventUpdateSchema), updateEvent);
router.patch('/:id/status', authenticate, authorize('Admin'), validate(eventStatusSchema), updateEventStatus);

export default router;
