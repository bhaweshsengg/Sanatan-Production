import { logger } from '../utils/logger.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { put, del } from '@vercel/blob';
import { prisma, repairTempleStatuses, ensureRequiredTables, ensureTemplePublicIdColumn } from '../config/db.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';
// import { v2 as cloudinary } from 'cloudinary';

// Cloudinary disabled - images are stored and served locally from hosting server
// if (env.cloudinary.enabled) {
//   cloudinary.config({
//     cloud_name: env.cloudinary.cloudName,
//     api_key: env.cloudinary.apiKey,
//     api_secret: env.cloudinary.apiSecret,
//   });
// }

const parseListField = (value) => {
  const results = [];

  const unwrap = (val) => {
    if (val === null || val === undefined) return;

    if (Array.isArray(val)) {
      for (const item of val) {
        unwrap(item);
      }
      return;
    }

    if (typeof val === 'string') {
      let trimmed = val.trim();
      if (!trimmed) return;

      // Handle deeply nested JSON strings (e.g. "[\"[\'\\\"...\\\']\"]")
      let parsed = false;
      if (
        (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith('{') && trimmed.endsWith('}'))
      ) {
        try {
          const parsedVal = JSON.parse(trimmed);
          unwrap(parsedVal);
          parsed = true;
        } catch {
          // fall through to regex cleanup
        }
      }

      if (!parsed) {
        // Strip escaped quotes, brackets, and redundant slashes
        const cleaned = trimmed
          .replace(/^[\[\]"'\\]+|[\[\]"'\\]+$/g, '')
          .replace(/\\+["']/g, '')
          .replace(/\\+/g, '')
          .trim();

        if (cleaned) {
          if (cleaned.includes(',')) {
            cleaned.split(',').forEach((part) => unwrap(part));
          } else {
            // Normalize service/facility name if it has spaces (e.g. "daily Aarti" -> "daily_aarti")
            results.push(cleaned);
          }
        }
      }
    } else {
      results.push(String(val).trim());
    }
  };

  unwrap(value);
  return Array.from(new Set(results.map((s) => s.trim()).filter(Boolean)));
};


const normalizeUploadedImagePath = (value) => {
  if (!value || typeof value !== 'string') return '';

  const normalized = value.replace(/\\/g, '/');
  const lastSegment = normalized.split('/').filter(Boolean).pop();

  if (!lastSegment) return '';

  return `/uploads/${lastSegment}`;
};

export const normalizeTempleRecord = (temple, options = {}) => {
  if (!temple) return null;

  const {
    your_name,
    your_email,
    role,
    termsAccepted,
    termsAcceptedAt,
    terms_accepted,
    terms_accepted_at,
    mandirRegistrations,
    ...publicFields
  } = temple;

  const base = options.includePrivate ? temple : publicFields;

  return {
    ...base,
    id: base.id,
    publicId: base.publicId ?? base.public_id ?? String(base.id),
    cityId: base.cityId ?? base.city_id,
    city_id: base.cityId ?? base.city_id,
    city: base.city,
    mainDeityId: base.mainDeityId ?? base.main_deity_id,
    main_deity_id: base.mainDeityId ?? base.main_deity_id,
    mainDeity: base.mainDeity,
    main_deity: base.mainDeity,
    images: (base.images || []).map((img) => ({
      ...img,
      file: /^https?:\/\//i.test(img.file || '')
        ? img.file
        : normalizeUploadedImagePath(img.file) || img.file,
    })),
    service_offered: typeof base.service_offered === 'string' ? parseListField(base.service_offered) : (base.service_offered || []),
    facilities_offered: typeof base.facilities_offered === 'string' ? parseListField(base.facilities_offered) : (base.facilities_offered || []),
    events: base.events || [],
  };
};

const uploadNewImage = async (file, folder = 'temples') => {
  const isBlobConfigured = Boolean(env.isBlobConfigured || env.blobToken || process.env.BLOB_READ_WRITE_TOKEN);
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const baseName = path.basename(file.originalname || 'image', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;

  if (isBlobConfigured) {
    const fileContent = file.buffer || (file.path ? await fs.readFile(file.path) : null);
    if (!fileContent) {
      logger.warn('uploadNewImage: File has no buffer or path', { file: file.originalname });
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

  // Fallback: local disk storage (for local dev when BLOB_READ_WRITE_TOKEN is not configured)
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

const saveNewImages = async (templeId, files) => {
  await Promise.all(files.slice(0, env.maxUploadFiles).map(async (file) => {
    const imageUrl = await uploadNewImage(file);
    if (imageUrl) {
      await prisma.templeImage.create({
        data: {
          templeId,
          file: imageUrl,
        },
      });
    }
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

const listTemplesRawFallback = async (req, res, { where = {}, sortDirection = 'desc', skip, limitNum, pageNum = 1 }) => {
  try {
    const rawTemples = await prisma.$queryRawUnsafe('SELECT * FROM `temple_temple`');
    if (!Array.isArray(rawTemples)) {
      return sendError(res, 500, 'Could not fetch temples', {});
    }

    const [cities, deities, images] = await Promise.all([
      prisma.$queryRawUnsafe('SELECT id, name FROM `temple_city`').catch(() => []),
      prisma.$queryRawUnsafe('SELECT id, name FROM `temple_maindeity`').catch(() => []),
      prisma.$queryRawUnsafe('SELECT id, templeId, file FROM `temple_image`').catch(() => []),
    ]);

    const cityMap = new Map((Array.isArray(cities) ? cities : []).map((c) => [c.id, c]));
    const deityMap = new Map((Array.isArray(deities) ? deities : []).map((d) => [d.id, d]));
    const imageMap = new Map();
    if (Array.isArray(images)) {
      for (const img of images) {
        const tid = img.templeId;
        if (!imageMap.has(tid)) imageMap.set(tid, []);
        imageMap.get(tid).push(img);
      }
    }

    let filtered = rawTemples.map((t) => ({
      ...t,
      publicId: t.public_id || String(t.id),
      city: cityMap.get(t.city_id) || null,
      mainDeity: deityMap.get(t.main_deity_id) || null,
      images: imageMap.get(t.id) || [],
      events: [],
    }));

    if (where.cityId) filtered = filtered.filter((t) => t.city_id === where.cityId);
    if (where.mainDeityId) filtered = filtered.filter((t) => t.main_deity_id === where.mainDeityId);
    if (where.id) filtered = filtered.filter((t) => t.id === where.id);
    if (where.status) filtered = filtered.filter((t) => t.status === where.status);
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim()) {
      const q = req.query.search.trim().toLowerCase();
      filtered = filtered.filter((t) =>
        (t.mandir_name && t.mandir_name.toLowerCase().includes(q)) ||
        (t.full_address && t.full_address.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => (sortDirection === 'asc' ? a.id - b.id : b.id - a.id));

    const total = filtered.length;
    const paginated = (skip !== undefined && limitNum !== undefined)
      ? filtered.slice(skip, skip + limitNum)
      : filtered;

    return sendSuccess(res, 200, {
      data: paginated.map(normalizeTempleRecord),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1,
      },
    });
  } catch (err) {
    logger.error('listTemplesRawFallback error', { message: err.message });
    return sendError(res, 500, 'Could not fetch temples', { details: err.message });
  }
};

const getTempleRawFallback = async (req, res, param, isNumeric) => {
  try {
    let rows;
    if (isNumeric) {
      rows = await prisma.$queryRawUnsafe('SELECT * FROM `temple_temple` WHERE `id` = ? LIMIT 1', Number(param));
    } else {
      try {
        rows = await prisma.$queryRawUnsafe('SELECT * FROM `temple_temple` WHERE `public_id` = ? LIMIT 1', param);
      } catch {
        rows = [];
      }
      if (!Array.isArray(rows) || rows.length === 0) {
        rows = await prisma.$queryRawUnsafe('SELECT * FROM `temple_temple` WHERE `mandir_name` = ? LIMIT 1', param);
      }
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return sendError(res, 404, 'Temple not found', {});
    }

    const t = rows[0];
    const [cities, deities, images] = await Promise.all([
      prisma.$queryRawUnsafe('SELECT id, name FROM `temple_city` WHERE id = ? LIMIT 1', t.city_id).catch(() => []),
      prisma.$queryRawUnsafe('SELECT id, name FROM `temple_maindeity` WHERE id = ? LIMIT 1', t.main_deity_id).catch(() => []),
      prisma.$queryRawUnsafe('SELECT id, templeId, file FROM `temple_image` WHERE templeId = ?', t.id).catch(() => []),
    ]);

    const templeObj = {
      ...t,
      publicId: t.public_id || String(t.id),
      city: Array.isArray(cities) && cities[0] ? cities[0] : null,
      mainDeity: Array.isArray(deities) && deities[0] ? deities[0] : null,
      images: Array.isArray(images) ? images : [],
      events: [],
    };

    return sendSuccess(res, 200, { data: normalizeTempleRecord(templeObj) });
  } catch (err) {
    logger.error('getTempleRawFallback error', { message: err.message });
    return sendError(res, 500, 'Could not fetch temple', { details: err.message });
  }
};

export const listTemples = async (req, res) => {
  try {
    await repairTempleStatuses();
    await ensureTemplePublicIdColumn().catch(() => {});
    const { city, deity, temple, status, search, page, limit, sort, order } = req.query;

    const where = {};
    if (city) where.cityId = Number(city);
    if (deity) where.mainDeityId = Number(deity);
    if (temple) where.id = Number(temple);
    if (status) where.status = status;
    if (search && typeof search === 'string' && search.trim()) {
      where.OR = [
        { mandir_name: { contains: search.trim() } },
        { full_address: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const sortDirection = (order || sort || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 20)) : undefined;
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    let temples;
    let total;

    try {
      [temples, total] = await Promise.all([
        prisma.temple.findMany({
          where,
          include: {
            city: true,
            mainDeity: true,
            images: true,
          },
          orderBy: { id: sortDirection },
          ...(skip !== undefined ? { skip } : {}),
          ...(limitNum !== undefined ? { take: limitNum } : {}),
        }),
        prisma.temple.count({ where }),
      ]);
    } catch (queryError) {
      if (queryError.message && (queryError.message.includes('public_id') || queryError.message.includes('column'))) {
        logger.warn('listTemples: public_id column error detected, attempting immediate schema repair...', {
          error: queryError.message,
        });
        await ensureTemplePublicIdColumn().catch(() => {});
        try {
          [temples, total] = await Promise.all([
            prisma.temple.findMany({
              where,
              include: {
                city: true,
                mainDeity: true,
                images: true,
              },
              orderBy: { id: sortDirection },
              ...(skip !== undefined ? { skip } : {}),
              ...(limitNum !== undefined ? { take: limitNum } : {}),
            }),
            prisma.temple.count({ where }),
          ]);
        } catch (retryError) {
          logger.warn('listTemples: retrying via raw SQL fallback without public_id', {
            error: retryError.message,
          });
          return await listTemplesRawFallback(req, res, {
            where,
            sortDirection,
            skip,
            limitNum,
            pageNum,
          });
        }
      } else {
        throw queryError;
      }
    }

    return sendSuccess(res, 200, { 
      data: temples.map(normalizeTempleRecord),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1
      }
    });
  } catch (error) {
    logger.error('listTemples error', { message: error.message });
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
      termsAccepted: true,
      termsAcceptedAt: new Date(),
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
    logger.error('createTemple error', { message: error.message });
    return sendError(res, 400, 'Could not create temple', { details: error.message });
  }
};

export const getTemple = async (req, res) => {
  try {
    await repairTempleStatuses();
    await ensureTemplePublicIdColumn().catch(() => {});
    await ensureRequiredTables().catch(() => {});

    const param = req.params.id ? String(req.params.id).trim() : '';
    if (!param) {
      return sendError(res, 400, 'Invalid temple identifier');
    }

    const isNumeric = /^\d+$/.test(param);
    const whereClause = isNumeric ? { id: Number(param) } : { publicId: param };

    let temple;
    try {
      temple = await prisma.temple.findUnique({
        where: whereClause,
        include: {
          city: true,
          mainDeity: true,
          images: true,
          events: {
            where: { status: 'Approved' },
            orderBy: { eventDate: 'asc' },
          },
        },
      });
    } catch (queryError) {
      if (queryError.message && (queryError.message.includes('public_id') || queryError.message.includes('column'))) {
        logger.warn('getTemple: public_id column error detected, attempting immediate schema repair...', {
          error: queryError.message,
        });
        await ensureTemplePublicIdColumn().catch(() => {});
        try {
          temple = await prisma.temple.findUnique({
            where: whereClause,
            include: {
              city: true,
              mainDeity: true,
              images: true,
            },
          });
        } catch (retryError) {
          logger.warn('getTemple: retrying via raw SQL fallback', { error: retryError.message });
          return await getTempleRawFallback(req, res, param, isNumeric);
        }
      } else {
        logger.warn('getTemple: events relation query failed, falling back to basic include', {
          param,
          error: queryError.message,
        });
        try {
          temple = await prisma.temple.findUnique({
            where: whereClause,
            include: {
              city: true,
              mainDeity: true,
              images: true,
            },
          });
        } catch (fallbackError) {
          if (fallbackError.message && (fallbackError.message.includes('public_id') || fallbackError.message.includes('column'))) {
            return await getTempleRawFallback(req, res, param, isNumeric);
          }
          throw fallbackError;
        }
      }
    }

    if (!temple) return sendError(res, 404, 'Temple not found', {});
    return sendSuccess(res, 200, { data: normalizeTempleRecord(temple) });
  } catch (error) {
    logger.error('getTemple error', { message: error.message });
    return sendError(res, 500, 'Could not fetch temple', { details: error.message });
  }
};

export const updateTemple = async (req, res) => {
  try {
    const param = req.params.id ? String(req.params.id).trim() : '';
    if (!param) return sendError(res, 400, 'Invalid temple identifier');

    const isNumeric = /^\d+$/.test(param);
    const whereClause = isNumeric ? { id: Number(param) } : { publicId: param };

    const current = await prisma.temple.findUnique({
      where: whereClause,
      include: { images: true },
    });

    if (!current) return sendError(res, 404, 'Temple not found', {});

    // IDOR / BOLA Authorization check:
    // Super Admins can update any temple.
    // TempleManagers can only update the specific temple they manage/own.
    if (req.user && req.user.role !== 'Admin') {
      const userEmail = (req.user.email || '').trim().toLowerCase();
      const isOwnerByEmail = Boolean(userEmail && current.your_email?.toLowerCase() === userEmail);
      let isApprovedAdmin = false;

      if (!isOwnerByEmail && userEmail) {
        const adminReg = await prisma.templeDevoteeRegistration.findFirst({
          where: {
            mandirId: current.id,
            email: userEmail,
            status: 'Approved',
            relation: {
              relationshipName: { in: ['Temple Admin', 'Admin', 'Temple Manager'] },
            },
          },
        });
        isApprovedAdmin = Boolean(adminReg);
      }

      if (!isOwnerByEmail && !isApprovedAdmin) {
        return sendError(res, 403, 'Forbidden: You do not have permission to manage this temple', {});
      }
    }

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

    // Strip privileged fields if caller is not Super Admin
    if (req.user && req.user.role !== 'Admin') {
      delete rawPayload.status;
      delete rawPayload.rating;
    }

    const cleanedPayload = Object.fromEntries(
      Object.entries(rawPayload).filter(([, value]) => value !== undefined)
    );

    const temple = await prisma.temple.update({
      where: { id: current.id },
      data: cleanedPayload,
      include: { city: true, mainDeity: true, images: true },
    });

    // Prune removed images if existing_images was provided by edit form
    if (req.body.existing_images !== undefined) {
      const keptRaw = Array.isArray(req.body.existing_images)
        ? req.body.existing_images
        : [req.body.existing_images];
      const kept = keptRaw.map((k) => String(k).trim()).filter(Boolean);

      const imagesToDelete = current.images.filter((img) => {
        return !kept.some((k) => {
          const normK = k.replace(/\\/g, '/').replace(/^https?:\/\/[^\/]+/, '');
          const normImg = (img.file || '').replace(/\\/g, '/').replace(/^https?:\/\/[^\/]+/, '');
          return (
            normK === normImg ||
            normK.endsWith(normImg) ||
            normImg.endsWith(normK) ||
            path.basename(normK) === path.basename(normImg) ||
            String(img.id) === k
          );
        });
      });

      for (const img of imagesToDelete) {
        if (img.file && img.file.includes('blob.vercel-storage.com')) {
          try {
            await del(img.file, {
              token: env.blobToken || process.env.BLOB_READ_WRITE_TOKEN,
            });
          } catch (delErr) {
            logger.warn('Failed to delete blob during update', { error: delErr.message, url: img.file });
          }
        } else if (img.file && !/^https?:\/\//i.test(img.file)) {
          const absolutePath = resolveLocalImagePath(img.file);
          if (absolutePath) {
            await fs.rm(absolutePath, { force: true }).catch(() => {});
          }
        }
        await prisma.templeImage.delete({ where: { id: img.id } }).catch(() => {});
      }
    }

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
    logger.error('updateTemple error', { message: error.message });
    return sendError(res, 400, 'Could not update temple', { details: error.message });
  }
};

export const deleteTemple = async (req, res) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized: Authentication required', {});
    }
    if (req.user.role !== 'Admin') {
      return sendError(res, 403, 'Forbidden: Only administrators can delete temples', {});
    }

    const param = req.params.id ? String(req.params.id).trim() : '';
    if (!param) return sendError(res, 400, 'Invalid temple identifier');

    const isNumeric = /^\d+$/.test(param);
    const whereClause = isNumeric ? { id: Number(param) } : { publicId: param };

    const temple = await prisma.temple.findUnique({
      where: whereClause,
      include: { images: true },
    });

    if (!temple) return sendError(res, 404, 'Temple not found', {});

    for (const image of temple.images) {
      const imagePath = image.file || '';
      if (/^https?:\/\//i.test(imagePath)) {
        if (imagePath.includes('blob.vercel-storage.com')) {
          try {
            await del(imagePath, {
              token: env.blobToken || process.env.BLOB_READ_WRITE_TOKEN,
            });
          } catch (delErr) {
            logger.warn('Failed to delete blob image', { error: delErr.message, url: imagePath });
          }
        }
        continue;
      }

      const absolutePath = resolveLocalImagePath(imagePath);
      if (absolutePath) await fs.rm(absolutePath, { force: true }).catch(() => {});
    }

    await prisma.temple.delete({ where: { id: temple.id } });
    return sendSuccess(res, 200, { message: 'Temple deleted successfully', data: {} });
  } catch (error) {
    logger.error('deleteTemple error', { message: error.message });
    return sendError(res, 400, 'Could not delete temple', { details: error.message });
  }
};

export const updateTempleStatus = async (req, res) => {
  try {
    await repairTempleStatuses();

    if (!req.user) {
      return sendError(res, 401, 'Unauthorized: Authentication required', {});
    }
    if (req.user.role !== 'Admin') {
      return sendError(res, 403, 'Forbidden: Only administrators can update temple status', {});
    }

    const param = req.params.id ? String(req.params.id).trim() : '';
    if (!param) return sendError(res, 400, 'Invalid temple identifier');

    const isNumeric = /^\d+$/.test(param);
    const whereClause = isNumeric ? { id: Number(param) } : { publicId: param };

    const current = await prisma.temple.findUnique({
      where: whereClause,
    });
    if (!current) return sendError(res, 404, 'Temple not found', {});

    const temple = await prisma.temple.update({
      where: { id: current.id },
      data: { status: req.body.status === 'Reject' ? 'Rejected' : req.body.status },
      include: { city: true, mainDeity: true, images: true },
    });

    return sendSuccess(res, 200, {
      message: 'Temple status updated successfully',
      data: normalizeTempleRecord(temple),
    });
  } catch (error) {
    logger.error('updateTempleStatus error', { message: error.message });
    return sendError(res, 400, 'Failed to update status', { details: error.message });
  }
};
