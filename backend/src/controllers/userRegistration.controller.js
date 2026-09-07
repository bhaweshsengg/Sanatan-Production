import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateApprovalLimit, isTempleAdminRelation } from '../utils/mandirApproval.js';

const normalizeRegistration = (registration) => ({
  ...registration,
  id: Number(registration.id),
  relationId: Number(registration.relationId),
  mandirId: Number(registration.mandirId),
  reviewedByUserId: registration.reviewedByUserId ? Number(registration.reviewedByUserId) : null,
});

export const listRelationOptions = async (_req, res) => {
  try {
    const relations = await prisma.relationToMandir.findMany({
      where: { isActive: true },
      orderBy: { relationshipName: 'asc' },
    });

    return sendSuccess(res, 200, { data: relations });
  } catch (error) {
    return sendError(res, 500, 'Could not load relationships', { details: error.message });
  }
};

export const createUserRegistration = async (req, res) => {
  try {
    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase().trim(),
      mobile: req.body.mobile.trim(),
      relationId: Number(req.body.relationId),
      mandirId: Number(req.body.mandirId),
    };

    const relation = await prisma.relationToMandir.findUnique({
      where: { id: payload.relationId },
    });

    if (!relation || !relation.isActive) {
      return sendError(res, 400, 'Selected relation is invalid or inactive.', {});
    }

    const mandir = await prisma.temple.findUnique({
      where: { id: payload.mandirId },
    });

    if (!mandir) {
      return sendError(res, 404, 'Selected Mandir was not found.', {});
    }

    const registration = await prisma.userMandirRegistration.create({
      data: {
        ...payload,
        status: 'Pending',
      },
      include: {
        relation: true,
        mandir: true,
      },
    });

    return sendSuccess(res, 201, {
      message: 'Registration submitted successfully and is pending approval.',
      data: normalizeRegistration(registration),
    });
  } catch (error) {
    if (error?.code === 'P2002') {
      return sendError(res, 409, 'A registration with this email already exists for the selected Mandir.', {});
    }

    return sendError(res, 400, 'Could not submit registration', { details: error.message });
  }
};

export const listPendingRegistrations = async (_req, res) => {
  try {
    const registrations = await prisma.userMandirRegistration.findMany({
      where: { status: 'Pending' },
      include: {
        relation: true,
        mandir: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 200, {
      data: registrations.map((registration) => normalizeRegistration({
        ...registration,
        mandir: registration.mandir,
        relation: registration.relation,
      })),
    });
  } catch (error) {
    return sendError(res, 500, 'Could not load pending registrations', { details: error.message });
  }
};

const updateRegistrationStatus = async (req, res, targetStatus) => {
  try {
    const registrationId = Number(req.params.id);

    const result = await prisma.$transaction(async (tx) => {
      const registration = await tx.userMandirRegistration.findUnique({
        where: { id: registrationId },
        include: { relation: true, mandir: true },
      });

      if (!registration) {
        const error = new Error('Registration not found');
        error.status = 404;
        throw error;
      }

      if (registration.status === targetStatus) {
        const error = new Error(`Registration is already ${targetStatus}.`);
        error.status = 400;
        throw error;
      }

      if (targetStatus === 'Approved' && isTempleAdminRelation(registration.relation.relationshipName)) {
        await tx.$queryRaw`SELECT id FROM temple_temple WHERE id = ${registration.mandirId} FOR UPDATE`;

        const approvedTempleAdmins = await tx.userMandirRegistration.count({
          where: {
            mandirId: registration.mandirId,
            status: 'Approved',
            relation: {
              relationshipName: 'Temple Admin',
            },
          },
        });

        validateApprovalLimit(approvedTempleAdmins);
      }

      const updated = await tx.userMandirRegistration.update({
        where: { id: registrationId },
        data: {
          status: targetStatus,
          reviewedByUserId: req.user.id,
          reviewedAt: new Date(),
          notes: req.body.notes || null,
        },
        include: { relation: true, mandir: true },
      });

      return updated;
    });

    return sendSuccess(res, 200, {
      message: `Registration ${targetStatus.toLowerCase()} successfully.`,
      data: normalizeRegistration(result),
    });
  } catch (error) {
    if (error.status === 404) {
      return sendError(res, 404, 'Registration not found', {});
    }

    if (error.message === 'Maximum 2 Temple Admins are already assigned to this Mandir.') {
      return sendError(res, 400, error.message, {});
    }

    return sendError(res, error.status || 400, 'Could not update registration', { details: error.message });
  }
};

export const approveUserRegistration = async (req, res) => updateRegistrationStatus(req, res, 'Approved');
export const rejectUserRegistration = async (req, res) => updateRegistrationStatus(req, res, 'Rejected');
