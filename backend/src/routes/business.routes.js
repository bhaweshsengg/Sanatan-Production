import express from 'express';

import {
  getBusinesses,
  getBusinessById,
  updateBusinessStatus,
  createBusiness,
  createAppointmentRequest,
} from '../controllers/business.controller.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import { appointmentLimiter } from '../middleware/rateLimiter.js';
import { createUploadMiddleware } from '../utils/fileUpload.js';
import { env } from '../config/env.js';

const router = express.Router();

const upload = createUploadMiddleware({
  maxFiles: env.maxUploadFiles,
  maxFileSize: 5 * 1024 * 1024,
});

router.get('/', optionalAuthenticate, getBusinesses);

router.get('/:id', optionalAuthenticate, getBusinessById);

router.post('/', optionalAuthenticate, upload.any(), createBusiness);

router.patch('/:id/status', authenticate, authorize('Admin'), updateBusinessStatus);

router.post('/:id/appointment', appointmentLimiter, createAppointmentRequest);

export default router;