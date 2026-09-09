import path from 'node:path';
import fs from 'node:fs/promises';
import { put, del } from '@vercel/blob';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { prisma, ensureEventAttendeeTable } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/response.js';

const normalizeUploadedImagePath = (value) => {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.replace(/\\/g, '/');
  const lastSegment = normalized.split('/').filter(Boolean).pop();
  if (!lastSegment) return '';
  return `/uploads/${lastSegment}`;
};

const uploadNewImage = async (file, folder = 'events') => {
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

const toEventData = (body) => ({
  title: body.title,
  category: body.category,
  description: body.description,
  imageUrl: body.imageUrl || null,
  eventDate: body.eventDate,
  startTime: body.startTime,
  endTime: body.endTime,
  multiDay: Boolean(body.multiDay),
  endDate: body.endDate || null,
  recurring: Boolean(body.recurring),
  frequency: body.frequency || null,
  registrationOpens: body.registrationOpens || null,
  registrationCloses: body.registrationCloses || null,
  templeId: body.templeId ? Number(body.templeId) : null,
  templeName: body.templeName,
  hallName: body.hallName || null,
  address: body.address || null,
  mapsLink: body.mapsLink || null,
  onlineLink: body.onlineLink || null,
});

const eventInclude = {
  organizer: { select: { id: true, username: true, email: true } },
  reviewer: { select: { id: true, username: true } },
  temple: { select: { id: true, mandir_name: true, full_address: true } },
};

export const listApprovedEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20, templeId } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      status: 'Approved',
      ...(templeId ? { templeId: Number(templeId) } : {}),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({ 
        where, 
        include: eventInclude, 
        orderBy: { eventDate: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.event.count({ where })
    ]);
    
    return sendSuccess(res, 200, { 
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch events', { details: error.message });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      prisma.event.findMany({ 
        include: eventInclude, 
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum 
      }),
      prisma.event.count()
    ]);

    return sendSuccess(res, 200, { 
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch event submissions', { details: error.message });
  }
};

export const getAdminEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: Number(req.params.id) }, include: eventInclude });
    if (!event) return sendError(res, 404, 'Event not found', {});
    return sendSuccess(res, 200, { data: event });
  } catch (error) {
    return sendError(res, 400, 'Could not fetch event', { details: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: {
        ...toEventData(req.body),
        organizerId: req.user?.id ?? null,
      },
    });
    return sendSuccess(res, 201, { data: event, message: 'Event submitted for admin approval' });
  } catch (error) {
    return sendError(res, 400, 'Could not create event', { details: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await prisma.event.update({ where: { id: Number(req.params.id) }, data: toEventData(req.body), include: eventInclude });
    return sendSuccess(res, 200, { data: event, message: 'Event updated successfully' });
  } catch (error) {
    return sendError(res, 400, 'Could not update event', { details: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data: { status: req.body.status, reviewedById: req.user.id },
      include: eventInclude,
    });
    return sendSuccess(res, 200, { data: event, message: `Event ${req.body.status.toLowerCase()} successfully` });
  } catch (error) {
    return sendError(res, 400, 'Could not update event status', { details: error.message });
  }
};

export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No image file uploaded');
    }

    const imageUrl = await uploadNewImage(req.file);
    if (!imageUrl) {
      return sendError(res, 400, 'Could not save uploaded image');
    }

    return sendSuccess(res, 200, {
      data: { url: imageUrl },
      url: imageUrl,
      message: 'Event image uploaded successfully',
    });
  } catch (error) {
    logger.error('uploadEventImage error', { message: error.message });
    return sendError(res, 500, 'Could not upload event image', { details: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!event) {
      return sendError(res, 404, 'Event not found', {});
    }

    if (event.imageUrl) {
      if (event.imageUrl.includes('blob.vercel-storage.com')) {
        try {
          await del(event.imageUrl, {
            token: env.blobToken || process.env.BLOB_READ_WRITE_TOKEN,
          });
        } catch (delErr) {
          logger.warn('Failed to delete blob event image', { error: delErr.message, url: event.imageUrl });
        }
      } else if (!/^https?:\/\//i.test(event.imageUrl)) {
        const normalized = event.imageUrl.replace(/\\/g, '/').replace(/^\/+/, '');
        const relativePath = normalized.startsWith('uploads/') ? normalized.slice('uploads/'.length) : normalized;
        const candidate = path.resolve(env.uploadDir, relativePath);
        const uploadRoot = path.resolve(env.uploadDir) + path.sep;
        if (candidate.startsWith(uploadRoot)) {
          await fs.rm(candidate, { force: true }).catch(() => {});
        }
      }
    }

    await prisma.event.delete({
      where: { id: Number(req.params.id) },
    });

    return sendSuccess(res, 200, {
      message: 'Event deleted successfully',
      data: {},
    });
  } catch (error) {
    logger.error('deleteEvent error', { message: error.message });
    return sendError(res, 400, 'Could not delete event', { details: error.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    await ensureEventAttendeeTable();
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'Invalid event id');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return sendError(res, 404, 'Event not found');
    }

    // Check for existing registration to prevent duplicates
    const existing = await prisma.eventAttendee.findFirst({
      where: {
        eventId,
        userId: req.user.id,
      },
    });

    if (existing) {
      return sendSuccess(res, 200, {
        message: 'You have already joined this event',
        data: {
          joined: true,
          alreadyJoined: true,
          attendees: event.attendees,
        },
      });
    }

    // Create attendee record
    await prisma.eventAttendee.create({
      data: {
        eventId,
        userId: req.user.id,
        name: req.user.username,
        email: req.user.email,
      },
    });

    // Recalculate actual attendee count to keep it completely accurate
    const attendeeCount = await prisma.eventAttendee.count({
      where: { eventId },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { attendees: attendeeCount },
    });

    return sendSuccess(res, 200, {
      message: 'Successfully joined the event',
      data: {
        joined: true,
        attendees: attendeeCount,
      },
    });
  } catch (error) {
    logger.error('joinEvent error', { message: error.message });
    return sendError(res, 500, 'Could not join event', { details: error.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    await ensureEventAttendeeTable();
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'Invalid event id');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return sendError(res, 404, 'Event not found');
    }

    // Delete attendee record
    await prisma.eventAttendee.deleteMany({
      where: {
        eventId,
        userId: req.user.id,
      },
    });

    // Recalculate actual attendee count
    const attendeeCount = await prisma.eventAttendee.count({
      where: { eventId },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { attendees: attendeeCount },
    });

    return sendSuccess(res, 200, {
      message: 'Successfully left the event',
      data: {
        joined: false,
        attendees: attendeeCount,
      },
    });
  } catch (error) {
    logger.error('leaveEvent error', { message: error.message });
    return sendError(res, 500, 'Could not leave event', { details: error.message });
  }
};

export const getMyJoinedEvents = async (req, res) => {
  try {
    await ensureEventAttendeeTable();
    const records = await prisma.eventAttendee.findMany({
      where: { userId: req.user.id },
      select: { eventId: true },
    });

    const eventIds = records.map((r) => String(r.eventId));
    return sendSuccess(res, 200, { data: eventIds });
  } catch (error) {
    logger.error('getMyJoinedEvents error', { message: error.message });
    return sendError(res, 500, 'Could not fetch joined events', { details: error.message });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    await ensureEventAttendeeTable();
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'Invalid event id');
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        category: true,
        templeName: true,
        hallName: true,
        eventDate: true,
        startTime: true,
        endTime: true,
        attendees: true,
        status: true,
      },
    });

    if (!event) {
      return sendError(res, 404, 'Event not found');
    }

    const attendees = await prisma.eventAttendee.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const formattedAttendees = attendees.map((att) => ({
      id: att.id,
      userId: att.userId,
      name: att.user?.username || att.name || 'Devotee',
      email: att.user?.email || att.email || 'N/A',
      role: att.user?.role || 'User',
      joinedAt: att.joinedAt,
    }));

    return sendSuccess(res, 200, {
      data: {
        event,
        total: formattedAttendees.length,
        attendees: formattedAttendees,
      },
    });
  } catch (error) {
    logger.error('getEventAttendees error', { message: error.message });
    return sendError(res, 500, 'Could not fetch event attendees', { details: error.message });
  }
};

