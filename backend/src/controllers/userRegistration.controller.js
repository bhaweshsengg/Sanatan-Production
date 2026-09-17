import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateApprovalLimit, isTempleAdminRelation } from '../utils/mandirApproval.js';

const getDevoteeModel = () => prisma.templeDevoteeRegistration || prisma.userMandirRegistration;

const normalizeRegistration = (registration) => {
  const { password, ...rest } = registration;
  return {
    ...rest,
    id: Number(registration.id),
    relationId: Number(registration.relationId),
    mandirId: Number(registration.mandirId),
    subscription: registration.subscription || 'No',
    reviewedByUserId: registration.reviewedByUserId ? Number(registration.reviewedByUserId) : null,
  };
};

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
    const email = req.body.email.toLowerCase().trim();
    const mandirId = Number(req.body.mandirId);
    const subscription = req.body.subscription === 'Yes' ? 'Yes' : 'No';

    // Verify Temple exists
    const mandir = await prisma.temple.findUnique({
      where: { id: mandirId },
    });

    if (!mandir) {
      return sendError(res, 404, 'Selected Temple was not found.', {});
    }

    if (mandir.status !== 'Approved') {
      return sendError(res, 400, 'Selected Temple is currently not active for devotee registration.', {});
    }

    // Determine Relation: use provided relationId or default to 'Temple Devotee'
    let relationId = req.body.relationId ? Number(req.body.relationId) : null;
    if (relationId) {
      const relation = await prisma.relationToMandir.findUnique({
        where: { id: relationId },
      });
      if (!relation || !relation.isActive) {
        return sendError(res, 400, 'Selected relation is invalid or inactive.', {});
      }
    } else {
      let devoteeRelation = await prisma.relationToMandir.findFirst({
        where: { relationshipName: 'Temple Devotee', isActive: true },
      });
      if (!devoteeRelation) {
        devoteeRelation = await prisma.relationToMandir.findFirst({
          where: { isActive: true },
        });
      }
      if (!devoteeRelation) {
        return sendError(res, 500, 'No active registration relationship available.', {});
      }
      relationId = devoteeRelation.id;
    }

    // Check for existing approved or pending registration for this email and temple
    const model = getDevoteeModel();
    const existingApproved = await model.findFirst({
      where: {
        email,
        mandirId,
        status: 'Approved',
      },
    });

    if (existingApproved) {
      return sendError(res, 409, 'You are already registered and approved as a Devotee for this Temple. You can log in directly.', {});
    }

    const existingPending = await model.findFirst({
      where: {
        email,
        mandirId,
        status: 'Pending',
      },
    });

    if (existingPending) {
      return sendError(res, 409, 'A pending registration with this email already exists for the selected Temple.', {});
    }

    // Hash password if provided
    let passwordHash = null;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    const registration = await model.create({
      data: {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email,
        mobile: req.body.mobile.trim(),
        password: passwordHash,
        subscription,
        relationId,
        mandirId,
        status: 'Pending',
      },
      include: {
        relation: true,
        mandir: true,
      },
    });

    return sendSuccess(res, 201, {
      message: 'Registration submitted successfully and is pending admin approval.',
      data: normalizeRegistration(registration),
    });
  } catch (error) {
    if (error?.code === 'P2002') {
      return sendError(res, 409, 'A registration with this email already exists for the selected Temple.', {});
    }

    return sendError(res, 400, 'Could not submit registration', { details: error.message });
  }
};

export const listPendingRegistrations = async (_req, res) => {
  try {
    const model = getDevoteeModel();
    const registrations = await model.findMany({
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
      const model = tx.templeDevoteeRegistration || tx.userMandirRegistration;
      const registration = await model.findUnique({
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

      if (targetStatus === 'Approved' && isTempleAdminRelation(registration.relation?.relationshipName)) {
        await tx.$queryRaw`SELECT id FROM temple_temple WHERE id = ${registration.mandirId} FOR UPDATE`;

        const approvedTempleAdmins = await model.count({
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

      const updated = await model.update({
        where: { id: registrationId },
        data: {
          status: targetStatus,
          reviewedByUserId: req.user.id,
          reviewedAt: new Date(),
          notes: req.body.notes || null,
        },
        include: { relation: true, mandir: true },
      });

      // If approved and password was set, ensure a Devotee user account exists
      if (targetStatus === 'Approved' && updated.password) {
        const existingUser = await tx.user.findFirst({
          where: {
            OR: [
              { email: updated.email },
              { username: updated.email },
            ],
          },
        });

        if (!existingUser) {
          await tx.user.create({
            data: {
              username: updated.email,
              email: updated.email,
              passwordHash: updated.password,
              role: 'Devotee',
              isActive: true,
            },
          });
        } else if (existingUser.role === 'User') {
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              role: 'Devotee',
              ...(existingUser.passwordHash ? {} : { passwordHash: updated.password }),
            },
          });
        }
      }

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
