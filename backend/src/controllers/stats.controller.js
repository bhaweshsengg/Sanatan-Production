import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [templeCount, eventCount, userCount, businessCount] = await Promise.all([
      prisma.temple.count(),
      prisma.event.count({ where: { status: 'Approved' } }),
      prisma.user.count(),
      prisma.business.count()
    ]);

    return sendSuccess(res, 200, {
      data: {
        temples: templeCount,
        events: eventCount,
        users: userCount,
        businesses: businessCount
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Could not fetch dashboard stats', { details: error.message });
  }
};
