import { prisma } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/response.js';

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
  templeName: body.templeName,
  hallName: body.hallName || null,
  address: body.address || null,
  mapsLink: body.mapsLink || null,
  onlineLink: body.onlineLink || null,
});

const eventInclude = {
  organizer: { select: { id: true, username: true, email: true } },
  reviewer: { select: { id: true, username: true } },
};

export const listApprovedEvents = async (_req, res) => {
  try {
    const events = await prisma.event.findMany({ where: { status: 'Approved' }, include: eventInclude, orderBy: { eventDate: 'asc' } });
    return sendSuccess(res, 200, { data: events });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch events', { details: error.message });
  }
};

export const getAdminEvents = async (_req, res) => {
  try {
    const events = await prisma.event.findMany({ include: eventInclude, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, 200, { data: events });
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
