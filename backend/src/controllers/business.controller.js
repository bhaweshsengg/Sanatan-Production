import path from 'node:path';
import fs from 'node:fs/promises';
import { put } from '@vercel/blob';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { prisma, ensureRequiredTables } from '../config/db.js';

const normalizeUploadedImagePath = (value) => {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.replace(/\\/g, '/');
  const lastSegment = normalized.split('/').filter(Boolean).pop();
  if (!lastSegment) return '';
  return `/uploads/${lastSegment}`;
};

const uploadNewImage = async (file, folder = 'businesses') => {
  if (!file) return '';
  const isBlobConfigured = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const baseName = path.basename(file.originalname || 'service', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;

  if (isBlobConfigured) {
    const fileContent = file.buffer || (file.path ? await fs.readFile(file.path) : null);
    if (!fileContent) {
      logger.warn('uploadNewImage: Business file has no buffer or path', { file: file.originalname });
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

const businessId = (value) => {
  if (!/^\d+$/.test(String(value))) {
    const error = new Error('Business id must be a positive integer');
    error.status = 400;
    throw error;
  }

  return BigInt(value);
};

const isMissingBusinessTable = (error) =>
  error?.code === 'P2021';

export const getBusinesses = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { page, limit, category } = req.query;
    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 50)) : undefined;
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    const where = {};
    if (category && category !== 'All') {
      where.category = { contains: category };
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: {
          id: 'desc',
        },
        ...(skip !== undefined ? { skip } : {}),
        ...(limitNum !== undefined ? { take: limitNum } : {}),
      }),
      prisma.business.count({ where })
    ]);

    res.json({
      success: true,
      status: 200,
      data: businesses.map((business) => ({
        ...business,
        id: business.id.toString(),
        images: business.imageUrl ? [{ file: business.imageUrl }] : [],
      })),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1
      }
    });
  } catch (error) {
    if (isMissingBusinessTable(error)) {
      return res.json({
        success: true,
        status: 200,
        data: [],
        message: 'No business records are available in the configured database.',
      });
    }

    logger.error('Could not fetch businesses:', error);

    res.status(500).json({
      success: false,
      status: 500,
      message: 'Could not fetch businesses',
      data: {
        details: error.message,
      },
    });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const business = await prisma.business.findUnique({
      where: { id: businessId(req.params.id) },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Business not found',
      });
    }

    res.json({
      success: true,
      status: 200,
      data: {
        ...business,
        id: business.id.toString(),
        images: business.imageUrl ? [{ file: business.imageUrl }] : [],
      },
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: error.message,
      });
    }

    if (isMissingBusinessTable(error)) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Business not found',
      });
    }

    logger.error('Could not fetch business:', error);

    res.status(500).json({
      success: false,
      status: 500,
      message: 'Could not fetch business',
      data: {
        details: error.message,
      },
    });
  }
};

export const updateBusinessStatus = async (req, res) => {
  try {
    await ensureRequiredTables();
    const allowedStatuses = new Set(['Pending', 'Approved', 'Rejected', 'Delist']);
    const { status } = req.body;

    if (!allowedStatuses.has(status)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid business status',
      });
    }

    const business = await prisma.business.update({
      where: { id: businessId(req.params.id) },
      data: {
        status,
        reviewedat: new Date(),
        ...(status === 'Approved' ? { approvedat: new Date() } : {}),
      },
    });

    return res.json({
      success: true,
      status: 200,
      data: {
        ...business,
        id: business.id.toString(),
        images: business.imageUrl ? [{ file: business.imageUrl }] : [],
      },
    });
  } catch (error) {
    if (isMissingBusinessTable(error)) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Business not found',
      });
    }

    const status = error.status || 400;
    logger.error('Could not update business status:', error);

    return res.status(status).json({
      success: false,
      status,
      message: 'Could not update business status',
      data: { details: error.message },
    });
  }
};

export const createBusiness = async (req, res) => {
  try {
    await ensureRequiredTables();
    const {
      firstName,
      lastName,
      category,
      description,
      address,
      city,
      phone,
      phoneNo,
      mobile,
      email,
      website,
      ownerName,
      ownerEmail,
      ownerPhone,
      services,
      operatingHours,
      specialOffers,
      facebookUrl,
      instagramUrl,
      twitterUrl,
    } = req.body;

    const resolvedOwnerName = (
      ownerName ||
      `${firstName || ''} ${lastName || ''}`.trim() ||
      'Service Provider'
    );

    const resolvedBusinessName = (
      req.body.businessName ||
      `${firstName || ''} ${lastName || ''}`.trim() ||
      `${category || 'Community'} Service`
    );

    const resolvedPhone = phone || phoneNo || mobile || '';
    const resolvedOwnerPhone = mobile || phone || phoneNo || '';
    const resolvedEmail = email || ownerEmail || '';
    const resolvedOwnerEmail = ownerEmail || email || '';

    // Handle file upload if provided
    let uploadedImageUrl = null;
    const file = req.file || (req.files && (Array.isArray(req.files) ? req.files[0] : (req.files['image']?.[0] || req.files['images']?.[0])));
    if (file) {
      uploadedImageUrl = await uploadNewImage(file, 'businesses');
    }

    const status = req.body.status || 'Approved';

    const business = await prisma.business.create({
      data: {
        businessName: resolvedBusinessName,
        category: category || 'General Sanatan Services',
        description: description || '',
        address: address || '',
        city: city || 'Auckland',
        phone: resolvedPhone,
        email: resolvedEmail,
        website: website || null,
        ownerName: resolvedOwnerName,
        ownerEmail: resolvedOwnerEmail,
        ownerPhone: resolvedOwnerPhone,
        services: services || null,
        operatingHours: operatingHours || null,
        specialOffers: specialOffers || null,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        twitterUrl: twitterUrl || null,
        status,
        imageUrl: uploadedImageUrl,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Service registered successfully',
      data: {
        ...business,
        id: business.id.toString(),
        images: business.imageUrl ? [{ file: business.imageUrl }] : [],
      },
    });
  } catch (error) {
    logger.error('Could not create business:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Could not create business',
      data: {
        details: error.message,
      },
    });
  }
};