import path from 'node:path';
import multer from 'multer';
import fs from 'node:fs';
import { env } from '../config/env.js';

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
];

export const imageFileFilter = (_req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname || '').toLowerCase();

  if (!ALLOWED_IMAGE_MIMES.includes(mime)) {
    return cb(new Error('Invalid file type: Only JPEG, PNG, WebP, and GIF images are allowed. SVGs and executable files are prohibited.'));
  }

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return cb(new Error('Invalid file extension: File extension does not match allowed image types (.jpg, .jpeg, .png, .webp, .gif).'));
  }

  cb(null, true);
};

export const createUploadMiddleware = ({
  maxFiles = env.maxUploadFiles || 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
} = {}) => {
  const uploadDir = path.resolve(env.uploadDir);
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch {
    // Ignore in read-only environments
  }

  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safeName);
    },
  });

  const isBlobEnabled = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
  const storage = (isBlobEnabled || env.cloudinary.enabled) ? multer.memoryStorage() : diskStorage;

  return multer({
    storage,
    limits: {
      files: maxFiles,
      fileSize: maxFileSize,
    },
    fileFilter: imageFileFilter,
  });
};
