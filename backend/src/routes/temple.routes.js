import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

import { env } from '../config/env.js';

import {
  createTemple,
  deleteTemple,
  getTemple,
  listTemples,
  updateTemple,
  updateTempleStatus,
} from '../controllers/temple.controller.js';

import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

import {
  templeCreateSchema,
  templeStatusSchema,
  templeUpdateSchema,
} from '../validators/temple.validator.js';

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

const storage = (isBlobEnabled || env.cloudinary.enabled)
  ? multer.memoryStorage()
  : diskStorage;

const upload = multer({
  storage,
  limits: {
    files: env.maxUploadFiles,
    fileSize: 10 * 1024 * 1024,
  },
});

router.get('/', listTemples);
router.get('/:id', getTemple);

// Public: anyone can submit a temple for review (no auth required)
router.post(
  '/',
  upload.array('uploaded_images', env.maxUploadFiles),
  validate(templeCreateSchema),
  createTemple
);

// Everything below requires authentication
router.use(authenticate);

router.put(
  '/:id',
  authorize('Admin', 'TempleManager'),
  upload.array('uploaded_images', env.maxUploadFiles),
  validate(templeUpdateSchema),
  updateTemple
);

router.delete('/:id', authorize('Admin', 'TempleManager'), deleteTemple);

router.patch(
  '/:id/status',
  authorize('Admin', 'TempleManager'),
  validate(templeStatusSchema),
  updateTempleStatus
);

export default router;