import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { env } from '../config/env.js';
import {
  createBlog,
  deleteBlog,
  getAdminBlogById,
  getPublicBlogById,
  listAdminBlogs,
  listPublicBlogs,
  updateBlog,
  updateBlogStatus,
  uploadBlogImage,
} from '../controllers/blog.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  blogCreateSchema,
  blogStatusSchema,
  blogUpdateSchema,
} from '../validators/blog.validator.js';

const router = Router();

const uploadDir = path.resolve(env.uploadDir);
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch {
  // Ignore directory creation error in read-only environments when using Blob
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

router.post('/upload-image', authenticate, authorize('Admin'), upload.single('image'), uploadBlogImage);
router.get('/', listPublicBlogs);
router.get('/admin', authenticate, authorize('Admin'), listAdminBlogs);
router.get('/admin/:id', authenticate, authorize('Admin'), getAdminBlogById);
router.get('/:id', getPublicBlogById);
router.post('/', authenticate, authorize('Admin'), validate(blogCreateSchema), createBlog);
router.put('/:id', authenticate, authorize('Admin'), validate(blogUpdateSchema), updateBlog);
router.patch('/:id/status', authenticate, authorize('Admin'), validate(blogStatusSchema), updateBlogStatus);
router.delete('/:id', authenticate, authorize('Admin'), deleteBlog);

export default router;
