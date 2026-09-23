import path from 'node:path';
import fs from 'node:fs/promises';
import { put } from '@vercel/blob';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { prisma, ensureRequiredTables } from '../config/db.js';
import { sendEmail } from '../utils/email.js';

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
    const { page, limit, category, city, status, search } = req.query;
    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 50)) : undefined;
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    const where = {};

    // Filter by Category
    if (category && category !== 'All' && category !== 'all') {
      where.category = { contains: category };
    }

    // Filter by City
    if (city && city !== 'All' && city !== 'all') {
      where.city = { contains: city };
    }

    // Filter by Status:
    // If 'all' is passed (e.g. from Admin review panel), do not filter by status.
    // If specific status (e.g. 'Pending', 'Approved', 'Rejected') is passed, filter by it.
    // If no status is specified (e.g. public directory), default to 'Approved'.
    if (status) {
      if (String(status).toLowerCase() !== 'all') {
        where.status = status;
      }
    } else {
      where.status = 'Approved';
    }

    // Filter by Search Query
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { businessName: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { ownerName: { contains: q } },
        { city: { contains: q } },
        { address: { contains: q } },
        { services: { contains: q } },
      ];
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
        linkedInUrl: business.linkedInUrl || null,
        fee: business.fee || null,
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
        linkedInUrl: business.linkedInUrl || null,
        fee: business.fee || null,
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
      linkedInUrl,
      fee,
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

    // Approval status workflow:
    // Only authenticated admins can directly set status (e.g. 'Approved').
    // All public community submissions default to 'Pending' so admins can review.
    const isAdminUser = req.user && req.user.role === 'Admin';
    const status = (isAdminUser && req.body.status) ? req.body.status : (req.body.status === 'Approved' && isAdminUser ? 'Approved' : 'Pending');

    const isTermsAccepted = req.body.termsAccepted === true || req.body.termsAccepted === 'true' || req.body.termsAccepted === 1 || req.body.termsAccepted === '1';
    if (!isTermsAccepted && !isAdminUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'You must agree to the Terms and Conditions to register a business',
      });
    }

    const consentDate = req.body.termsAcceptedAt ? new Date(req.body.termsAcceptedAt) : new Date();
    const validConsentDate = isTermsAccepted ? (isNaN(consentDate.getTime()) ? new Date() : consentDate) : null;

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
        linkedInUrl: linkedInUrl || null,
        fee: fee || null,
        status,
        imageUrl: uploadedImageUrl,
        termsAccepted: isTermsAccepted,
        termsAcceptedAt: validConsentDate,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: status === 'Pending' 
        ? 'Service submitted successfully for approval. It will appear publicly once approved by an administrator.'
        : 'Service registered successfully',
      data: {
        ...business,
        id: business.id.toString(),
        linkedInUrl: business.linkedInUrl || null,
        fee: business.fee || null,
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

export const createAppointmentRequest = async (req, res) => {
  try {
    await ensureRequiredTables();
    const bizId = businessId(req.params.id);

    const business = await prisma.business.findUnique({
      where: { id: bizId },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Service provider not found',
      });
    }

    const {
      fullName,
      name,
      email,
      phone,
      mobile,
      preferredDate,
      date,
      preferredTime,
      time,
      notes,
      serviceName
    } = req.body;

    const clientName = (fullName || name || '').trim();
    const clientEmail = (email || '').trim();
    const clientPhone = (phone || mobile || '').trim();
    const clientDate = (preferredDate || date || '').trim();
    const clientTime = (preferredTime || time || '').trim();
    const clientNotes = (notes || '').trim();
    const selectedService = (serviceName || business.businessName || 'General Community Service').trim();

    if (!clientName || !clientEmail || !clientPhone || !clientDate) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Name, email, phone number, and preferred date are required for appointment booking',
      });
    }

    const termsAccepted = req.body.termsAccepted === true || req.body.termsAccepted === 'true' || req.body.termsAccepted === 1 || req.body.termsAccepted === '1';
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'You must agree to the Terms and Conditions to book an appointment',
      });
    }

    // Save appointment request record in service_appointment table
    await prisma.$executeRawUnsafe(
      `INSERT INTO service_appointment (business_id, name, email, phone, preferred_date, preferred_time, notes, service_name, terms_accepted, terms_accepted_at, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), 'Pending', NOW())`,
      bizId,
      clientName,
      clientEmail,
      clientPhone,
      clientDate,
      clientTime || null,
      clientNotes || null,
      selectedService
    );

    // Notify service provider via email
    const providerEmail = business.email || business.ownerEmail;
    if (providerEmail) {
      try {
        await sendEmail({
          to: providerEmail,
          subject: `New Service Appointment Request: ${clientName} for ${business.businessName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 12px; background: #fffaf0;">
              <h2 style="color: #ea580c; margin-top: 0;">🕉️ New Appointment Request</h2>
              <p>You have received a new appointment booking request for <strong>${business.businessName}</strong>.</p>
              <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e5e7eb;">
                <p style="margin: 6px 0;"><strong>Client Name:</strong> ${clientName}</p>
                <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
                <p style="margin: 6px 0;"><strong>Phone:</strong> <a href="tel:${clientPhone}">${clientPhone}</a></p>
                <p style="margin: 6px 0;"><strong>Requested Date:</strong> ${clientDate}</p>
                <p style="margin: 6px 0;"><strong>Requested Time:</strong> ${clientTime || 'Flexible / Any time'}</p>
                <p style="margin: 6px 0;"><strong>Service:</strong> ${selectedService}</p>
                ${clientNotes ? `<p style="margin: 6px 0;"><strong>Notes / Requirements:</strong> ${clientNotes}</p>` : ''}
              </div>
              <p style="color: #6b7280; font-size: 13px;">Please contact the client promptly at ${clientPhone} or ${clientEmail} to confirm your appointment.</p>
            </div>
          `,
        });
      } catch (mailErr) {
        logger.warn('Failed to send email to provider:', mailErr.message);
      }
    }

    // Send confirmation email to client
    try {
      await sendEmail({
        to: clientEmail,
        subject: `Appointment Request Received: ${business.businessName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 12px; background: #fffaf0;">
            <h2 style="color: #ea580c; margin-top: 0;">🕉️ Appointment Request Received</h2>
            <p>Dear ${clientName},</p>
            <p>Your appointment request for <strong>${business.businessName}</strong> has been received by the service provider.</p>
            <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e5e7eb;">
              <p style="margin: 6px 0;"><strong>Provider:</strong> ${business.ownerName || business.businessName}</p>
              <p style="margin: 6px 0;"><strong>Provider Phone:</strong> ${business.phone || business.ownerPhone || 'N/A'}</p>
              <p style="margin: 6px 0;"><strong>Requested Date:</strong> ${clientDate}</p>
              <p style="margin: 6px 0;"><strong>Requested Time:</strong> ${clientTime || 'Flexible / Any time'}</p>
              ${business.fee ? `<p style="margin: 6px 0;"><strong>Fee / Dakshina:</strong> ${business.fee}</p>` : ''}
            </div>
            <p style="color: #6b7280; font-size: 13px;">The provider will contact you shortly to confirm the appointment.</p>
          </div>
        `,
      });
    } catch (mailErr) {
      logger.warn('Failed to send confirmation to client:', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'Appointment request sent successfully! The service provider has been notified.',
      data: {
        businessId: business.id.toString(),
        businessName: business.businessName,
        clientName,
        clientDate,
        clientTime,
      },
    });
  } catch (error) {
    logger.error('Could not create appointment request:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Could not submit appointment request',
      data: { details: error.message },
    });
  }
};