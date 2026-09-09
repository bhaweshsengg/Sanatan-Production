import express from 'express';

import {
  getBusinesses,
  getBusinessById,
  updateBusinessStatus,
  createBusiness,
} from '../controllers/business.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { env } from '../config/env.js';

const router = express.Router();

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
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, safeName);
  },
});

const isBlobEnabled = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
const storage = (isBlobEnabled || env.cloudinary.enabled) ? multer.memoryStorage() : diskStorage;
const upload = multer({ storage, limits: { files: env.maxUploadFiles } });

router.get('/', getBusinesses);

router.get('/:id', getBusinessById);

router.post('/', authenticate, upload.array('images', env.maxUploadFiles), createBusiness);

router.patch('/:id/status', authenticate, authorize('Admin', 'BusinessManager'), updateBusinessStatus);

export default router;