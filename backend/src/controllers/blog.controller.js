import path from 'node:path';
import fs from 'node:fs/promises';
import { put, del } from '@vercel/blob';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { prisma, ensureRequiredTables } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/response.js';

const normalizeUploadedImagePath = (value) => {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.replace(/\\/g, '/');
  const lastSegment = normalized.split('/').filter(Boolean).pop();
  if (!lastSegment) return '';
  return `/uploads/${lastSegment}`;
};

const uploadNewImage = async (file, folder = 'blogs') => {
  const isBlobConfigured = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const baseName = path.basename(file.originalname || 'blog', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;

  if (isBlobConfigured) {
    const fileContent = file.buffer || (file.path ? await fs.readFile(file.path) : null);
    if (!fileContent) {
      logger.warn('uploadNewImage: Blog file has no buffer or path', { file: file.originalname });
      return '';
    }

    const blob = await put(`${folder}/${safeName}`, fileContent, {
      access: 'public',
      token: env.blobToken || process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype || 'image/jpeg',
    });

    if (file.path) {
      await fs.unlink(file.path).catch(() => {});
    }

    return blob.url;
  }

  // Fallback: local disk storage
  const uploadDir = path.resolve(env.uploadDir);
  await fs.mkdir(uploadDir, { recursive: true });

  if (file.buffer) {
    const targetPath = path.join(uploadDir, safeName);
    await fs.writeFile(targetPath, file.buffer);
    return `/uploads/${safeName}`;
  }

  if (file.path || file.filename) {
    const normalized = normalizeUploadedImagePath(file.path || file.filename);
    return normalized || `/uploads/${file.filename}`;
  }

  return '';
};

const calculateReadTime = (content = '') => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const generateSlug = (title = '') => {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100);
  return `${base}-${Date.now().toString(36)}`;
};

export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Image file is required');
    }

    const imageUrl = await uploadNewImage(req.file, 'blogs');
    if (!imageUrl) {
      return sendError(res, 500, 'Failed to store uploaded blog image');
    }

    return sendSuccess(res, 201, {
      message: 'Blog image uploaded successfully',
      data: { imageUrl },
      imageUrl,
    });
  } catch (error) {
    logger.error('uploadBlogImage error:', error);
    return sendError(res, 500, 'Failed to upload blog image', { details: error.message });
  }
};

export const listPublicBlogs = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { category, search, limit, page } = req.query;

    const where = {
      status: 'Published',
    };

    if (category && category !== 'All' && category !== 'all') {
      where.category = {
        equals: String(category).trim(),
      };
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      where.OR = [
        { title: { contains: term } },
        { excerpt: { contains: term } },
        { content: { contains: term } },
        { tags: { contains: term } },
        { authorName: { contains: term } },
      ];
    }

    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 20)) : undefined;
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        ...(skip !== undefined ? { skip } : {}),
        ...(limitNum !== undefined ? { take: limitNum } : {}),
        include: {
          author: {
            select: { id: true, username: true, email: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return res.json({
      success: true,
      status: 200,
      data: blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1,
      },
    });
  } catch (error) {
    logger.error('listPublicBlogs error:', error);
    return sendError(res, 500, 'Failed to fetch public blogs', { details: error.message });
  }
};

export const getPublicBlogById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(String(id));

    const blog = await prisma.blogPost.findFirst({
      where: {
        ...(isNumeric ? { id: Number(id) } : { slug: String(id) }),
        status: 'Published',
      },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!blog) {
      return sendError(res, 404, 'Blog post not found');
    }

    return sendSuccess(res, 200, {
      message: 'Blog post retrieved successfully',
      data: blog,
    });
  } catch (error) {
    logger.error('getPublicBlogById error:', error);
    return sendError(res, 500, 'Failed to fetch blog post', { details: error.message });
  }
};

export const listAdminBlogs = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { status, category, search } = req.query;

    const where = {};
    if (status && status !== 'All' && status !== 'all') {
      where.status = status;
    }
    if (category && category !== 'All' && category !== 'all') {
      where.category = String(category).trim();
    }
    if (search && String(search).trim()) {
      const term = String(search).trim();
      where.OR = [
        { title: { contains: term } },
        { excerpt: { contains: term } },
        { authorName: { contains: term } },
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { id: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    return sendSuccess(res, 200, {
      message: 'Admin blogs retrieved successfully',
      data: blogs,
    });
  } catch (error) {
    logger.error('listAdminBlogs error:', error);
    return sendError(res, 500, 'Failed to fetch admin blogs', { details: error.message });
  }
};

export const getAdminBlogById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const id = Number(req.params.id);
    if (!id) {
      return sendError(res, 400, 'Invalid blog id');
    }

    const blog = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!blog) {
      return sendError(res, 404, 'Blog post not found');
    }

    return sendSuccess(res, 200, {
      message: 'Blog retrieved successfully',
      data: blog,
    });
  } catch (error) {
    logger.error('getAdminBlogById error:', error);
    return sendError(res, 500, 'Failed to fetch blog post', { details: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    await ensureRequiredTables();
    const data = req.body;

    const readTime = data.readTime && data.readTime.trim()
      ? data.readTime.trim()
      : calculateReadTime(data.content);

    const slug = generateSlug(data.title);
    const status = data.status || 'Draft';
    const publishedAt = status === 'Published' ? new Date() : null;

    const blog = await prisma.blogPost.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim(),
        imageUrl: data.imageUrl || null,
        authorName: data.authorName?.trim() || req.user?.username || 'Sanatan NZ Admin',
        authorId: req.user?.id || null,
        status,
        tags: data.tags?.trim() || null,
        readTime,
        publishedAt,
      },
    });

    return sendSuccess(res, 201, {
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error) {
    logger.error('createBlog error:', error);
    return sendError(res, 500, 'Failed to create blog post', { details: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    await ensureRequiredTables();
    const id = Number(req.params.id);
    if (!id) {
      return sendError(res, 400, 'Invalid blog id');
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 404, 'Blog post not found');
    }

    const data = req.body;
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.category !== undefined) updateData.category = data.category.trim();
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt.trim();
    if (data.content !== undefined) {
      updateData.content = data.content.trim();
      if (!data.readTime) {
        updateData.readTime = calculateReadTime(data.content);
      }
    }
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
    if (data.authorName !== undefined) updateData.authorName = data.authorName.trim();
    if (data.tags !== undefined) updateData.tags = data.tags ? data.tags.trim() : null;
    if (data.readTime !== undefined && data.readTime.trim()) updateData.readTime = data.readTime.trim();

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'Published' && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 200, {
      message: 'Blog post updated successfully',
      data: updated,
    });
  } catch (error) {
    logger.error('updateBlog error:', error);
    return sendError(res, 500, 'Failed to update blog post', { details: error.message });
  }
};

export const updateBlogStatus = async (req, res) => {
  try {
    await ensureRequiredTables();
    const id = Number(req.params.id);
    if (!id) {
      return sendError(res, 400, 'Invalid blog id');
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 404, 'Blog post not found');
    }

    const { status } = req.body;
    const updateData = { status };
    if (status === 'Published' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 200, {
      message: `Blog post status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    logger.error('updateBlogStatus error:', error);
    return sendError(res, 500, 'Failed to update blog status', { details: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await ensureRequiredTables();
    const id = Number(req.params.id);
    if (!id) {
      return sendError(res, 400, 'Invalid blog id');
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 404, 'Blog post not found');
    }

    await prisma.blogPost.delete({ where: { id } });

    return sendSuccess(res, 200, {
      message: 'Blog post deleted successfully',
      data: { id },
    });
  } catch (error) {
    logger.error('deleteBlog error:', error);
    return sendError(res, 500, 'Failed to delete blog post', { details: error.message });
  }
};
