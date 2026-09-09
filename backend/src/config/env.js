import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({
  path: backendEnvPath,
  override: false,
});

const resolvedDatabaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

if (!resolvedDatabaseUrl) {
  throw new Error('DATABASE_URL or MYSQL_URL must be configured before starting the backend.');
}

if (process.env.NODE_ENV === 'production') {
  const isDefaultAccess = (process.env.JWT_ACCESS_SECRET || 'dev-access-secret') === 'dev-access-secret';
  const isDefaultRefresh = (process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') === 'dev-refresh-secret';
  
  if (isDefaultAccess || isDefaultRefresh) {
    throw new Error('JWT secrets must be explicitly configured in production. Cannot use default dev secrets.');
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: resolvedDatabaseUrl,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  jwtResetSecret: process.env.JWT_RESET_SECRET || 'dev-reset-secret',
  jwtResetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || '15m',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  uploadDir: process.env.VERCEL
    ? '/tmp/uploads'
    : process.env.UPLOAD_DIR || (process.env.NODE_ENV === 'production' ? '/tmp/uploads' : './uploads'),
  corsOrigin: [
    ...(process.env.CORS_ORIGIN || 'http://localhost:4200,http://localhost:5173')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean),
    'https://sanatan-production-frontend.vercel.app',
  ],
  maxUploadFiles: Number(process.env.MAX_UPLOAD_FILES || 5),
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
  isBlobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    enabled: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  },
};
