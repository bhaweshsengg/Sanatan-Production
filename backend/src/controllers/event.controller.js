import path from 'node:path';
import fs from 'node:fs/promises';
import { put, del } from '@vercel/blob';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { prisma, ensureEventAttendeeTable, ensureEventCommunityColumns } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { sendEmail } from '../utils/email.js';

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

const toEventData = (body) => {
  const isFestival = body.category && (
    body.category.toLowerCase().includes('festival') ||
    body.category === 'Religious Observance' ||
    ['hindu', 'jain', 'sikh', 'baudh'].includes(body.category.toLowerCase().trim())
  );

  let resolvedTempleName = (body.templeName || '').trim();
  if (!resolvedTempleName && isFestival) {
    resolvedTempleName = (body.communityName || '').trim() || (body.address || '').trim() || 'Sanatan Community';
  }

  return {
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
    templeName: resolvedTempleName,
    communityId: body.communityId ? Number(body.communityId) : null,
    communityName: body.communityName ? body.communityName.trim() : null,
    hallName: body.hallName || null,
    address: body.address || null,
    mapsLink: body.mapsLink || null,
    onlineLink: body.onlineLink || null,
  };
};

const publicEventInclude = {
  organizer: { select: { id: true, username: true } },
  reviewer: { select: { id: true, username: true } },
  temple: { select: { id: true, mandir_name: true, full_address: true } },
  communityGroup: { select: { id: true, name: true, slug: true, cityName: true } },
};

const eventInclude = {
  organizer: { select: { id: true, username: true, email: true } },
  reviewer: { select: { id: true, username: true } },
  temple: { select: { id: true, mandir_name: true, full_address: true } },
  communityGroup: { select: { id: true, name: true, slug: true, cityName: true } },
};

export const listApprovedEvents = async (req, res) => {
  try {
    const { page = 1, limit, templeId, category, search } = req.query;
    const isPaginated = limit !== 'all';
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 20)) : undefined;
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    const where = {
      status: 'Approved',
      ...(templeId ? { templeId: Number(templeId) } : {}),
    };

    if (category && typeof category === 'string' && category.trim()) {
      const catTrim = category.trim();
      if (catTrim.toLowerCase() === 'festival') {
        where.OR = [
          { category: 'Festival' },
          { category: 'Major Festival' },
          { category: 'Religious Observance' },
          { category: { contains: 'Festival' } },
          { category: { contains: 'festival' } },
          { category: 'Hindu' },
          { category: 'Jain' },
          { category: 'Sikh' },
          { category: 'Baudh' },
        ];
      } else {
        where.category = catTrim;
      }
    }

    if (search && typeof search === 'string' && search.trim()) {
      const searchTrim = search.trim();
      const searchConditions = [
        { title: { contains: searchTrim } },
        { description: { contains: searchTrim } },
        { templeName: { contains: searchTrim } },
      ];
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    await ensureEventCommunityColumns().catch(() => {});

    let events;
    let total;

    try {
      [events, total] = await Promise.all([
        prisma.event.findMany({ 
          where, 
          include: publicEventInclude, 
          orderBy: { eventDate: 'asc' },
          ...(skip !== undefined ? { skip } : {}),
          ...(limitNum !== undefined ? { take: limitNum } : {}),
        }),
        prisma.event.count({ where })
      ]);
    } catch (queryError) {
      if (
        queryError.message &&
        (queryError.message.includes('community_id') ||
          queryError.message.includes('community_name') ||
          queryError.message.includes('communityGroup') ||
          queryError.message.includes('Unknown column'))
      ) {
        logger.warn('listApprovedEvents: community column missing, executing emergency schema fix...', {
          error: queryError.message,
        });
        try {
          await prisma.$executeRawUnsafe('ALTER TABLE `community_event` ADD COLUMN `community_id` INT NULL;');
        } catch {}
        try {
          await prisma.$executeRawUnsafe('ALTER TABLE `community_event` ADD COLUMN `community_name` VARCHAR(191) NULL;');
        } catch {}

        try {
          [events, total] = await Promise.all([
            prisma.event.findMany({
              where,
              include: publicEventInclude,
              orderBy: { eventDate: 'asc' },
              ...(skip !== undefined ? { skip } : {}),
              ...(limitNum !== undefined ? { take: limitNum } : {}),
            }),
            prisma.event.count({ where }),
          ]);
        } catch (retryError) {
          logger.warn('listApprovedEvents: falling back to safe include without communityGroup...', {
            error: retryError.message,
          });
          const safeInclude = {
            organizer: { select: { id: true, username: true } },
            reviewer: { select: { id: true, username: true } },
            temple: { select: { id: true, mandir_name: true, full_address: true } },
          };
          [events, total] = await Promise.all([
            prisma.event.findMany({
              where,
              include: safeInclude,
              orderBy: { eventDate: 'asc' },
              ...(skip !== undefined ? { skip } : {}),
              ...(limitNum !== undefined ? { take: limitNum } : {}),
            }),
            prisma.event.count({ where }),
          ]);
        }
      } else {
        throw queryError;
      }
    }
    
    return sendSuccess(res, 200, { 
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: limitNum ? Math.ceil(total / limitNum) : 1
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch events', { details: error.message });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    await ensureEventCommunityColumns().catch(() => {});
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
    await ensureEventCommunityColumns().catch(() => {});
    const event = await prisma.event.findUnique({ where: { id: Number(req.params.id) }, include: eventInclude });
    if (!event) return sendError(res, 404, 'Event not found', {});
    return sendSuccess(res, 200, { data: event });
  } catch (error) {
    return sendError(res, 400, 'Could not fetch event', { details: error.message });
  }
};

export const getPublicEvent = async (req, res) => {
  try {
    await ensureEventCommunityColumns().catch(() => {});
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendError(res, 400, 'Invalid event id');
    }

    let event;
    try {
      event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: { select: { id: true, username: true, email: true } },
          reviewer: { select: { id: true, username: true } },
          temple: { select: { id: true, mandir_name: true, full_address: true, phone_no: true, email: true, website: true, publicId: true } },
          communityGroup: { select: { id: true, name: true, slug: true, cityName: true } },
        },
      });
    } catch {
      event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: { select: { id: true, username: true, email: true } },
          reviewer: { select: { id: true, username: true } },
          temple: { select: { id: true, mandir_name: true, full_address: true, phone_no: true, email: true, website: true, publicId: true } },
        },
      });
    }

    if (!event) {
      return sendError(res, 404, 'Event not found');
    }

    return sendSuccess(res, 200, { data: event });
  } catch (error) {
    logger.error('getPublicEvent error', { message: error.message });
    return sendError(res, 500, 'Could not fetch event', { details: error.message });
  }
};

export const notifyDevoteesForTempleEvent = async (event) => {
  if (!event || !event.templeId) {
    return;
  }

  try {
    const templeId = Number(event.templeId);
    if (!Number.isInteger(templeId) || templeId <= 0) return;

    // 1. Fetch the temple details
    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
      select: { id: true, mandir_name: true, full_address: true, email: true },
    });

    const templeName = temple?.mandir_name || event.templeName || 'Mandir';

    // 2. Fetch approved devotees for this temple
    const devotees = await prisma.templeDevoteeRegistration.findMany({
      where: {
        mandirId: templeId,
        status: 'Approved',
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!Array.isArray(devotees) || devotees.length === 0) {
      logger.info('notifyDevoteesForTempleEvent: No approved devotees found for temple', { templeId });
      return;
    }

    // 3. Deduplicate devotee recipients by email (case-insensitive)
    const uniqueRecipients = new Map();
    for (const d of devotees) {
      const email = (d.email || '').toLowerCase().trim();
      if (email && email.includes('@') && !uniqueRecipients.has(email)) {
        uniqueRecipients.set(email, d);
      }
    }

    if (uniqueRecipients.size === 0) return;

    const eventDateStr = event.multiDay && event.endDate
      ? `${event.eventDate} to ${event.endDate}`
      : event.eventDate || 'Upcoming Date';
    const eventTimeStr = event.startTime && event.endTime
      ? `${event.startTime} - ${event.endTime}`
      : (event.startTime || 'Scheduled Time');
    const venueStr = event.hallName
      ? `${templeName} (${event.hallName})`
      : (event.address || temple?.full_address || templeName);

    // 4. Send email notification safely to each devotee
    for (const [recipientEmail, devotee] of uniqueRecipients) {
      try {
        const devoteeName = devotee.firstName ? `${devotee.firstName} ${devotee.lastName || ''}`.trim() : 'Devotee';
        await sendEmail({
          to: recipientEmail,
          subject: `🕉️ New Event Notification: "${event.title}" at ${templeName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 16px; background-color: #fffbf5;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 36px;">🕉️</span>
                <h1 style="color: #c2410c; margin: 8px 0 4px 0; font-size: 22px;">Sanatan New Zealand</h1>
                <p style="color: #9a3412; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Temple Devotee Community Notice</p>
              </div>

              <div style="background: #ffffff; border: 1px solid #fed7aa; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <p style="color: #374151; font-size: 15px; margin-top: 0;">Namaste <strong>${devoteeName}</strong>,</p>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                  A new community gathering and sacred event has been announced for <strong>${templeName}</strong>:
                </p>

                <div style="border-left: 4px solid #ea580c; background: #fff7ed; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
                  <h2 style="color: #9a3412; margin: 0 0 10px 0; font-size: 18px;">${event.title}</h2>
                  <p style="margin: 4px 0; color: #4b5563; font-size: 13px;"><strong>🏷️ Category:</strong> ${event.category || 'Community Event'}</p>
                  <p style="margin: 4px 0; color: #4b5563; font-size: 13px;"><strong>📅 Date:</strong> ${eventDateStr}</p>
                  <p style="margin: 4px 0; color: #4b5563; font-size: 13px;"><strong>🕐 Time:</strong> ${eventTimeStr}</p>
                  <p style="margin: 4px 0; color: #4b5563; font-size: 13px;"><strong>📍 Venue:</strong> ${venueStr}</p>
                  ${event.communityName ? `<p style="margin: 4px 0; color: #4b5563; font-size: 13px;"><strong>👥 Host Group:</strong> ${event.communityName}</p>` : ''}
                </div>

                ${event.description ? `
                  <div style="margin: 16px 0;">
                    <h3 style="color: #374151; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">Event Details:</h3>
                    <p style="color: #4b5563; font-size: 13px; line-height: 1.6; white-space: pre-line; margin-top: 0;">${event.description}</p>
                  </div>
                ` : ''}

                <div style="text-align: center; margin-top: 24px;">
                  <a href="${env.frontendUrl || 'https://sanatan.org.nz'}/events/${event.id}"
                     style="display: inline-block; background: linear-gradient(to right, #ea580c, #dc2626); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(234, 88, 12, 0.3);">
                    View Event &amp; Join
                  </a>
                </div>
              </div>

              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 4px 0;">You are receiving this notice because you are a registered and approved Devotee of ${templeName}.</p>
                <p style="margin: 4px 0;">© Sanatan New Zealand. Preserving and promoting Dharma in Aotearoa.</p>
              </div>
            </div>
          `,
        });
      } catch (singleMailErr) {
        logger.warn('Failed to send event notification email to devotee', {
          recipientEmail,
          eventId: event.id,
          error: singleMailErr.message,
        });
      }
    }
  } catch (err) {
    logger.warn('notifyDevoteesForTempleEvent error', {
      eventId: event.id,
      error: err.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    await ensureEventCommunityColumns().catch(() => {});
    const event = await prisma.event.create({
      data: {
        ...toEventData(req.body),
        organizerId: req.user?.id ?? null,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    if (event.templeId) {
      setImmediate(() => {
        notifyDevoteesForTempleEvent(event).catch(() => {});
      });
    }

    return sendSuccess(res, 201, { data: event, message: 'Event submitted for admin approval' });
  } catch (error) {
    return sendError(res, 400, 'Could not create event', { details: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return sendError(res, 403, 'Forbidden: Only administrators can update events', {});
    }
    await ensureEventCommunityColumns().catch(() => {});
    const event = await prisma.event.update({ where: { id: Number(req.params.id) }, data: toEventData(req.body), include: eventInclude });
    return sendSuccess(res, 200, { data: event, message: 'Event updated successfully' });
  } catch (error) {
    return sendError(res, 400, 'Could not update event', { details: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return sendError(res, 403, 'Forbidden: Only administrators can update event status', {});
    }
    const event = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data: { status: req.body.status, reviewedById: req.user.id },
      include: eventInclude,
    });

    if (event.status === 'Approved' && event.templeId) {
      setImmediate(() => {
        notifyDevoteesForTempleEvent(event).catch(() => {});
      });
    }

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
    if (!req.user || req.user.role !== 'Admin') {
      return sendError(res, 403, 'Forbidden: Only administrators can delete events', {});
    }
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

