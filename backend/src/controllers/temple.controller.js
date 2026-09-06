import { logger } from '../utils/logger.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma, repairTempleStatuses } from '../config/db.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { v2 as cloudinary } from 'cloudinary';

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

const parseListField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const normalizeUploadedImagePath = (value) => {
  if (!value || typeof value !== 'string') return '';

  const normalized = value.replace(/\\/g, '/');
  const lastSegment = normalized.split('/').filter(Boolean).pop();

  if (!lastSegment) return '';

  return `/uploads/${lastSegment}`;
};

const normalizeTempleRecord = (temple) => ({
  ...temple,
  city: temple.city,
  main_deity: temple.mainDeity,
  images: temple.images || [],
  service_offered: typeof temple.service_offered === 'string' ? parseListField(temple.service_offered) : temple.service_offered,
  facilities_offered: typeof temple.facilities_offered === 'string' ? parseListField(temple.facilities_offered) : temple.facilities_offered,
});

const uploadNewImage = (file) => {
  if (!env.cloudinary.enabled) {
    return Promise.resolve(file.path);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sanatan/temples',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

const saveNewImages = async (templeId, files) => {
  await Promise.all(files.slice(0, env.maxUploadFiles).map(async (file) => {
    const imageUrl = await uploadNewImage(file);
    await prisma.templeImage.create({
      data: {
        templeId,
        file: imageUrl,
      },
    });
  }));
};

const resolveLocalImagePath = (imagePath) => {
  const normalized = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const relativePath = normalized.startsWith('uploads/')
    ? normalized.slice('uploads/'.length)
    : normalized;
  const candidate = path.resolve(env.uploadDir, relativePath);
  const uploadRoot = path.resolve(env.uploadDir) + path.sep;

  return candidate.startsWith(uploadRoot) ? candidate : null;
};

export const listTemples = async (req, res) => {
  try {
    await repairTempleStatuses();
    const { city, deity, temple, page = 1, limit = 20 } = req.query;

    const where = {};
    if (city) where.cityId = Number(city);
    if (deity) where.mainDeityId = Number(deity);
    if (temple) where.id = Number(temple);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [temples, total] = await Promise.all([
      prisma.temple.findMany({
        where,
        include: {
          city: true,
          mainDeity: true,
          images: true,
        },
        orderBy: { id: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.temple.count({ where })
    ]);

    return sendSuccess(res, 200, { 
      data: temples.map(normalizeTempleRecord),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch temples', { details: error.message });
  }
};

export const createTemple = async (req, res) => {
  try {
    const parsedYear = Number(req.body.year_established);
    const payload = {
      mandir_name: req.body.mandir_name,
      full_address: req.body.full_address,
      cityId: Number(req.body.city_id),
      year_established: Number.isInteger(parsedYear) && parsedYear > 0
        ? parsedYear
        : new Date().getFullYear(),
      mainDeityId: Number(req.body.main_deity_id),
      description: req.body.description,
      phone_no: req.body.phone_no,
      email: req.body.email || req.body.your_email,
      website: req.body.website || '',
      opening_hours: req.body.opening_hours,
      service_offered: JSON.stringify(parseListField(req.body.service_offered || [])),
      facilities_offered: JSON.stringify(parseListField(req.body.facilities_offered || [])),
      your_name: req.body.your_name,
      your_email: req.body.your_email,
      rating: Number(req.body.rating || 0),
      location: req.body.location,
      status: req.body.status || 'Pending',
      role: req.body.role || 'devotee',
    };

    const temple = await prisma.temple.create({
      data: payload,
      include: {
        city: true,
        mainDeity: true,
        images: true,
      },
    });

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length) {
      await saveNewImages(temple.id, files);
    }

    const savedTemple = await prisma.temple.findUnique({
      where: { id: temple.id },
      include: { city: true, mainDeity: true, images: true },
    });

    return sendSuccess(res, 201, { data: normalizeTempleRecord(savedTemple), message: 'Temple created successfully' });
  } catch (error) {
    return sendError(res, 400, 'Could not create temple', { details: error.message });
  }
};

export const getTemple = async (req, res) => {
  try {
    await repairTempleStatuses();
    const temple = await prisma.temple.findUnique({
      where: { id: Number(req.params.id) },
      include: { city: true, mainDeity: true, images: true },
    });

    if (!temple) return sendError(res, 404, 'Temple not found', {});
    return sendSuccess(res, 200, { data: normalizeTempleRecord(temple) });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch temple', { details: error.message });
  }
};

export const updateTemple = async (req, res) => {
  try {
    const current = await prisma.temple.findUnique({
      where: { id: Number(req.params.id) },
      include: { images: true },
    });

    if (!current) return sendError(res, 404, 'Temple not found', {});

    const rawPayload = {
      mandir_name: req.body.mandir_name,
      full_address: req.body.full_address,
      cityId: req.body.city_id ? Number(req.body.city_id) : undefined,
      year_established: req.body.year_established ? Number(req.body.year_established) : undefined,
      mainDeityId: req.body.main_deity_id ? Number(req.body.main_deity_id) : undefined,
      description: req.body.description,
      phone_no: req.body.phone_no,
      email: req.body.email,
      website: req.body.website,
      opening_hours: req.body.opening_hours,
      service_offered: req.body.service_offered !== undefined ? JSON.stringify(parseListField(req.body.service_offered || [])) : undefined,
      facilities_offered: req.body.facilities_offered !== undefined ? JSON.stringify(parseListField(req.body.facilities_offered || [])) : undefined,
      your_name: req.body.your_name,
      your_email: req.body.your_email,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : undefined,
      location: req.body.location,
      status: req.body.status,
      role: req.body.role,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(rawPayload).filter(([, value]) => value !== undefined)
    );

    const temple = await prisma.temple.update({
      where: { id: Number(req.params.id) },
      data: cleanedPayload,
      include: { city: true, mainDeity: true, images: true },
    });

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length) {
      await saveNewImages(temple.id, files);
    }

    const updated = await prisma.temple.findUnique({
      where: { id: temple.id },
      include: { city: true, mainDeity: true, images: true },
    });

    return sendSuccess(res, 200, { data: normalizeTempleRecord(updated), message: 'Temple updated successfully' });
  } catch (error) {
    return sendError(res, 400, 'Could not update temple', { details: error.message });
  }
};

export const deleteTemple = async (req, res) => {
  try {
    const temple = await prisma.temple.findUnique({
      where: { id: Number(req.params.id) },
      include: { images: true },
    });

    if (!temple) return sendError(res, 404, 'Temple not found', {});

    for (const image of temple.images) {
      const imagePath = image.file || '';
      if (/^https?:\/\//i.test(imagePath)) continue;

      const absolutePath = resolveLocalImagePath(imagePath);
      if (absolutePath) await fs.rm(absolutePath, { force: true });
    }

    await prisma.temple.delete({ where: { id: Number(req.params.id) } });
    return sendSuccess(res, 200, { message: 'Temple deleted successfully', data: {} });
  } catch (error) {
    return sendError(res, 400, 'Could not delete temple', { details: error.message });
  }
};

export const updateTempleStatus = async (req, res) => {
  try {
    await repairTempleStatuses();
    const temple = await prisma.temple.update({
      where: { id: Number(req.params.id) },
      data: { status: req.body.status === 'Reject' ? 'Rejected' : req.body.status },
      include: { city: true, mainDeity: true, images: true },
    });

    return sendSuccess(res, 200, {
      message: 'Temple status updated successfully',
      data: normalizeTempleRecord(temple),
    });
  } catch (error) {
    return sendError(res, 400, 'Failed to update status', { details: error.message });
  }
};
