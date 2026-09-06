import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';

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
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        orderBy: {
          id: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.business.count()
    ]);

    res.json({
      success: true,
      status: 200,
      data: businesses.map((business) => ({
        ...business,
        id: business.id.toString(),
      })),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
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
      },
    });

    return res.json({
      success: true,
      status: 200,
      data: { ...business, id: business.id.toString() },
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
    const {
      businessName,
      category,
      description,
      address,
      city,
      phone,
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

    const business = await prisma.business.create({
      data: {
        businessName,
        category,
        description,
        address,
        city,
        phone,
        email,
        website: website || null,
        ownerName,
        ownerEmail,
        ownerPhone,
        services: services || null,
        operatingHours: operatingHours || null,
        specialOffers: specialOffers || null,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        twitterUrl: twitterUrl || null,
        status: 'Pending',
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      status: 201,
      data: {
        ...business,
        id: business.id.toString(),
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