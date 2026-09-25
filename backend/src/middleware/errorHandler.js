import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, _req, res, _next) => {
  const status = Number(err.status || err.statusCode) || 500;

  if (status >= 500) {
    logger.error('Unhandled Server Error:', {
      message: err.message,
      stack: err.stack,
      details: err.details,
    });
  }

  const isProd = env.nodeEnv === 'production';
  const safeMessage = (isProd && status >= 500)
    ? 'Internal server error'
    : (err.message || 'Internal server error');

  const safeDetails = (isProd && status >= 500)
    ? null
    : (err.details || null);

  res.status(status).json({
    success: false,
    status,
    message: safeMessage,
    data: {
      details: safeDetails,
    },
  });
};

