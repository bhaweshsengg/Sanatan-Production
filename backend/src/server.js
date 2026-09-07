import 'dotenv/config';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import morgan from 'morgan';

import { env } from './config/env.js';
import { prisma } from './config/db.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/auth.routes.js';
import cityRoutes from './routes/city.routes.js';
import deityRoutes from './routes/deity.routes.js';
import templeRoutes from './routes/temple.routes.js';
import businessRoutes from './routes/business.routes.js';
import userRegistrationRoutes from './routes/userRegistration.routes.js';
import eventRoutes from './routes/event.routes.js';
import statsRoutes from './routes/stats.routes.js';
import communityRoutes from './routes/community.routes.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Vercel proxy ke peeche hai — X-Forwarded-For header trust karo
app.set('trust proxy', 1);

// Use morgan for HTTP request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

/* =========================
   CORS  (must run BEFORE static files so images get the header)
========================= */

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = env.corsOrigin || [
      'http://localhost:4200',
      'http://localhost:5173',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  credentials: false,
};

app.use(cors(corsOptions));

/* =========================
   SECURITY  (must run BEFORE static files)
========================= */

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

/* =========================
   STATIC FILES (uploaded images)
========================= */
const fallbackTempleImage = path.resolve(env.uploadDir, 'temple_images', 'temple1.jpg');

// Middleware to add cross-origin headers to every static image response
const staticCorsMiddleware = (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

app.use('/uploads', staticCorsMiddleware, (req, res, next) => {
  const requestedPath = decodeURIComponent(req.path || '').replace(/^\/+/, '');
  if (!requestedPath) return next();

  const absolutePath = path.resolve(env.uploadDir, requestedPath);
  if (fs.existsSync(absolutePath)) {
    return next();
  }

  const templeImagePath = path.resolve(env.uploadDir, 'temple_images', requestedPath);
  if (fs.existsSync(templeImagePath)) {
    return res.sendFile(templeImagePath);
  }

  if (fs.existsSync(fallbackTempleImage)) {
    return res.sendFile(fallbackTempleImage);
  }

  return next();
});

app.use('/uploads', staticCorsMiddleware, express.static(path.resolve(env.uploadDir)));
app.use('/temple_images', staticCorsMiddleware, express.static(path.resolve(env.uploadDir, 'temple_images')));
app.use(staticCorsMiddleware, express.static(path.resolve(env.uploadDir)));

/* =========================
   BODY PARSER
========================= */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   RATE LIMIT
========================= */

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.nodeEnv === 'production' ? 5000 : 100000,
    skip: () => env.nodeEnv === 'development',
  })
);

/* =========================
   HEALTH CHECK
========================= */

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Sanatan backend is running',
  });
});

/* =========================
   API ROUTES
========================= */

app.use('/api/v1', authRoutes);
app.use('/api/v1/city', cityRoutes);
app.use('/api/v1/deity', deityRoutes);
app.use('/api/v1/temple', templeRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/user-registration', userRegistrationRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/community', communityRoutes);

/* =========================
   PUBLIC API ROUTES
========================= */

app.use('/api/v1/public/users', authRoutes);
app.use('/api/v1/public/city', cityRoutes);
app.use('/api/v1/public/deity', deityRoutes);
app.use('/api/v1/public/temple', templeRoutes);
app.use('/api/v1/public/business', businessRoutes);
app.use('/api/v1/public/user-registration', userRegistrationRoutes);
app.use('/api/v1/public/event', eventRoutes);
app.use('/api/v1/public/community', communityRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

/* =========================
   START SERVER
   Vercel imports this module and calls the exported app directly as a
   request handler — it never runs app.listen(), and a module-level
   process.exit(1) would crash the whole function on any DB hiccup.
   Only listen on a port when running locally / on a traditional host.
========================= */

if (!process.env.VERCEL) {
  prisma
    .$connect()
    .then(() => {
      logger.info('Database connected successfully');
      app.listen(env.port, '0.0.0.0', () => {
        logger.info(`Server running on port ${env.port}`);
      });
    })
    .catch((error) => {
      logger.error('Failed to connect to database', error);
      process.exit(1);
    });
}

export default app;