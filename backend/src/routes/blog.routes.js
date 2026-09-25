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

import { createUploadMiddleware } from '../utils/fileUpload.js';

const upload = createUploadMiddleware({
  maxFiles: 1,
  maxFileSize: 5 * 1024 * 1024,
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
