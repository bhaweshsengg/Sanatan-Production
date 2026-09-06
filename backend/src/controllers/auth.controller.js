import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendEmail } from '../utils/email.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Default role for self-registered users
    const role = 'User';

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return sendError(res, 400, 'Username or email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role,
        isActive: true
      }
    });

    return sendSuccess(res, 201, {
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Registration failed', { details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      return sendError(res, 400, 'Invalid credentials', {});
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const roleDisplay = user.role === 'Admin' ? 'Super Admin' : user.role;

    return sendSuccess(res, 200, {
      message: 'Login successful',
      data: {
        id: user.id,
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

    const resetUrl = `http://localhost:4200/auth/reset-password?token=${resetToken}`;
    
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

    if (!token || !newPassword) {
      return sendError(res, 400, 'Token and new password are required');
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
