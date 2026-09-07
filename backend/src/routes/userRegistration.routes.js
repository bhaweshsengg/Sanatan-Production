import { Router } from 'express';
import {
  approveUserRegistration,
  createUserRegistration,
  listPendingRegistrations,
  listRelationOptions,
  rejectUserRegistration,
} from '../controllers/userRegistration.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registrationSchema, registrationStatusSchema } from '../validators/userRegistration.validator.js';

const router = Router();

router.get('/relations', listRelationOptions);
router.post('/', validate(registrationSchema), createUserRegistration);

router.get('/pending', authenticate, authorize('Admin'), listPendingRegistrations);
router.patch('/:id/approve', authenticate, authorize('Admin'), validate(registrationStatusSchema), approveUserRegistration);
router.patch('/:id/reject', authenticate, authorize('Admin'), validate(registrationStatusSchema), rejectUserRegistration);

export default router;
