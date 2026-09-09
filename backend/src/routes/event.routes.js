import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { env } from '../config/env.js';
import {
  createEvent,
  deleteEvent,
  getAdminEvent,
  getAdminEvents,
  listApprovedEvents,
  updateEvent,
  updateEventStatus,
  uploadEventImage,
  joinEvent,
  leaveEvent,
  getMyJoinedEvents,
  getEventAttendees,
} from '../controllers/event.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { eventCreateSchema, eventStatusSchema, eventUpdateSchema } from '../validators/event.validator.js';

const router = Router();

const uploadDir = path.resolve(env.uploadDir);
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch {
  // Ignore directory creation error in read-only environments when using Blob/Cloudinary
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);
    cb(null, safeName);
  },
});

const isBlobEnabled = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
const storage = (isBlobEnabled || env.cloudinary.enabled) ? multer.memoryStorage() : diskStorage;

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/upload-image', upload.single('image'), uploadEventImage);
router.get('/', listApprovedEvents);
router.get('/admin', authenticate, authorize('Admin'), getAdminEvents);
router.get('/admin/:id', authenticate, authorize('Admin'), getAdminEvent);
router.post('/', validate(eventCreateSchema), (req, res, next) => {
  if (!req.headers.authorization) {
    return createEvent(req, res);
  }
  return authenticate(req, res, next);
}, createEvent);
router.get('/my-joined', authenticate, getMyJoinedEvents);
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);
router.get('/admin/:id/attendees', authenticate, authorize('Admin'), getEventAttendees);
router.get('/:id/attendees', authenticate, authorize('Admin'), getEventAttendees);
router.put('/:id', authenticate, authorize('Admin'), validate(eventUpdateSchema), updateEvent);
router.delete('/:id', authenticate, authorize('Admin'), deleteEvent);
router.patch('/:id/status', authenticate, authorize('Admin'), validate(eventStatusSchema), updateEventStatus);

export default router;
