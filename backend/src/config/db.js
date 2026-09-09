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

const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or MYSQL_URL must be configured before Prisma is initialized.');
}

const { PrismaClient } = await import('@prisma/client');

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

let templeStatusRepair;

export const repairTempleStatuses = () => {
  if (!templeStatusRepair) {
    templeStatusRepair = prisma.$executeRawUnsafe(
      "UPDATE temple_temple SET status = 'Pending' WHERE status IS NULL OR status = '' OR status = 'Reject'"
    ).catch((error) => {
      templeStatusRepair = undefined;
      throw error;
    });
  }

  return templeStatusRepair;
};

let eventAttendeeTablePromise;

export const ensureEventAttendeeTable = () => {
  if (!eventAttendeeTablePromise) {
    eventAttendeeTablePromise = prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`community_event_attendee\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`event_id\` INT NOT NULL,
        \`user_id\` INT NOT NULL,
        \`name\` VARCHAR(191) NULL,
        \`email\` VARCHAR(191) NULL,
        \`joined_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`event_user_unique\` (\`event_id\`, \`user_id\`),
        INDEX \`community_event_attendee_event_id_idx\` (\`event_id\`),
        INDEX \`community_event_attendee_user_id_idx\` (\`user_id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `).catch((error) => {
      eventAttendeeTablePromise = undefined;
      throw error;
    });
  }

  return eventAttendeeTablePromise;
};
