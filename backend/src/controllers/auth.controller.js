import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, ensureRequiredTables } from '../config/db.js';
import { env } from '../config/env.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendEmail } from '../utils/email.js';

export const register = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { fullName, name, username, email, password, role: reqRole, termsAccepted, termsAcceptedAt } = req.body;
    const resolvedFullName = (fullName || name || username || '').trim();

    if (!resolvedFullName) {
      return sendError(res, 400, 'Full Name is required');
    }

    if (!email || !String(email).trim()) {
      return sendError(res, 400, 'Valid email address is required');
    }

    const isTermsAccepted = termsAccepted === true || termsAccepted === 'true' || termsAccepted === 1 || termsAccepted === '1';
    if (!isTermsAccepted) {
      return sendError(res, 400, 'You must agree to the Terms and Conditions to register');
    }

    // Default role for self-registered users: restrict to unprivileged roles to prevent privilege escalation
    let role = 'User';
    if (reqRole) {
      const capitalized = reqRole.charAt(0).toUpperCase() + reqRole.slice(1).toLowerCase();
      // Admins, TempleManagers, and BusinessManagers cannot be self-assigned
      if (['User', 'Devotee', 'Priest'].includes(capitalized)) {
        role = capitalized;
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: resolvedFullName }]
      }
    });

    if (existingUser) {
      if (existingUser.email?.toLowerCase() === cleanEmail) {
        return sendError(res, 400, 'An account with this email address already exists');
      }
      return sendError(res, 400, 'An account with this Full Name already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const consentDate = termsAcceptedAt ? new Date(termsAcceptedAt) : new Date();
    const validConsentDate = isNaN(consentDate.getTime()) ? new Date() : consentDate;

    const newUser = await prisma.user.create({
      data: {
        username: resolvedFullName,
        email: cleanEmail,
        passwordHash,
        role,
        isActive: true,
        termsAccepted: true,
        termsAcceptedAt: validConsentDate
      }
    });

    return sendSuccess(res, 201, {
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        fullName: newUser.username,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        termsAccepted: newUser.termsAccepted,
        termsAcceptedAt: newUser.termsAcceptedAt
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Registration failed', { details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier) {
      return sendError(res, 400, 'Email address is required', {});
    }

    const user = await prisma.user.findFirst({ 
      where: { 
        OR: [
          { email: identifier },
          { username: identifier }
        ] 
      } 
    });

    // Constant-time dummy hash comparison to prevent timing attacks / user enumeration
    const DUMMY_HASH = '$2a$10$e7Bf6ZcW7.9Yd4rM5K5Qse1g3W7GkG3H0W2Y9R4D6Q8K2Y9R4D6Q8';
    const hashToCompare = user?.passwordHash || DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(password || '', hashToCompare);

    if (!user || !user.isActive || !isPasswordValid) {
      return sendError(res, 400, 'Invalid email or password', {});
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const roleDisplay = user.role === 'Admin' ? 'Super Admin' : user.role;

    return sendSuccess(res, 200, {
      message: 'Login successful',
      data: {
        id: user.id,
        fullName: user.username,
        username: user.username,
        email: user.email,
        role: roleDisplay,
        access: accessToken,
        refresh: refreshToken,
        expires_in: 15 * 60,
      },
    });
  } catch (error) {
    return sendError(res, 500, 'Login failed', { details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return sendError(res, 400, 'Refresh token is required', {});
    }

    jwt.verify(refresh, env.jwtRefreshSecret);

    return sendSuccess(res, 200, {
      message: 'Logout successful',
      data: {},
    });
  } catch (error) {
    return sendError(res, 400, 'Invalid or expired token', { details: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return sendError(res, 400, 'Refresh token is required', {});
    }

    const decoded = jwt.verify(refresh, env.jwtRefreshSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user || !user.isActive) {
      return sendError(res, 401, 'Invalid user or account deactivated', {});
    }

    const accessToken = signAccessToken(user);

    return sendSuccess(res, 200, {
      message: 'Token refreshed',
      data: {
        access: accessToken,
        expires_in: 15 * 60,
      },
    });
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired refresh token', { details: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    // We don't want to leak whether the email exists or not for security,
    // so we return success either way.
    if (!user || !user.isActive) {
      return sendSuccess(res, 200, { message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { sub: user.id, email: user.email }, 
      env.jwtResetSecret, 
      { expiresIn: env.jwtResetExpiresIn }
    );

    const frontendBaseUrl = req.headers.origin && env.corsOrigin.includes(req.headers.origin)
      ? req.headers.origin
      : (env.corsOrigin[0] || 'http://localhost:4200');
    const resetUrl = `${frontendBaseUrl}/auth/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Sanatan New Zealand - Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password.</p>
        <p>This link is valid for 15 minutes.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    return sendSuccess(res, 200, { message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    return sendError(res, 500, 'Failed to process forgot password request', { details: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return sendError(res, 400, 'Token and a valid new password (at least 6 characters) are required');
    }

    const decoded = jwt.verify(token, env.jwtResetSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user || !user.isActive) {
      return sendError(res, 401, 'Invalid user or account deactivated');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    return sendSuccess(res, 200, { message: 'Password has been reset successfully' });
  } catch (error) {
    return sendError(res, 400, 'Invalid or expired reset token', { details: error.message });
  }
};
