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

// Backward-compatibility alias
if (!prisma.userMandirRegistration && prisma.templeDevoteeRegistration) {
  prisma.userMandirRegistration = prisma.templeDevoteeRegistration;
}


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

let requiredTablesPromise;

export const ensureRequiredTables = async () => {
  if (!requiredTablesPromise) {
    requiredTablesPromise = (async () => {
      // 1. community_event
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`community_event\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`title\` VARCHAR(191) NOT NULL,
          \`category\` VARCHAR(191) NOT NULL,
          \`description\` TEXT NOT NULL,
          \`imageUrl\` VARCHAR(2048) NULL,
          \`status\` ENUM('Pending','Approved','Rejected','Cancelled','Completed') NOT NULL DEFAULT 'Pending',
          \`eventDate\` VARCHAR(191) NOT NULL,
          \`startTime\` VARCHAR(191) NOT NULL,
          \`endTime\` VARCHAR(191) NOT NULL,
          \`multiDay\` TINYINT(1) NOT NULL DEFAULT 0,
          \`endDate\` VARCHAR(191) NULL,
          \`recurring\` TINYINT(1) NOT NULL DEFAULT 0,
          \`frequency\` VARCHAR(191) NULL,
          \`registrationOpens\` VARCHAR(191) NULL,
          \`registrationCloses\` VARCHAR(191) NULL,
          \`templeName\` VARCHAR(191) NOT NULL,
          \`hallName\` VARCHAR(191) NULL,
          \`address\` VARCHAR(191) NULL,
          \`mapsLink\` VARCHAR(2048) NULL,
          \`onlineLink\` VARCHAR(2048) NULL,
          \`attendees\` INT NOT NULL DEFAULT 0,
          \`organizer_id\` INT NULL,
          \`reviewed_by_id\` INT NULL,
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          \`temple_id\` INT NULL,
          PRIMARY KEY (\`id\`),
          INDEX \`community_event_status_idx\` (\`status\`),
          INDEX \`community_event_organizer_id_idx\` (\`organizer_id\`),
          INDEX \`community_event_temple_id_idx\` (\`temple_id\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 2. community_event_attendee
      await prisma.$executeRawUnsafe(`
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
      `);

      // 3. Discussion
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`Discussion\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`title\` VARCHAR(191) NOT NULL,
          \`category\` VARCHAR(191) NOT NULL,
          \`tags\` TEXT NULL,
          \`content\` TEXT NOT NULL,
          \`authorId\` INT NOT NULL,
          \`cityId\` INT NULL,
          \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          INDEX \`Discussion_authorId_idx\` (\`authorId\`),
          INDEX \`Discussion_cityId_idx\` (\`cityId\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 4. Comment
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`Comment\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`content\` TEXT NOT NULL,
          \`authorId\` INT NOT NULL,
          \`discussionId\` INT NOT NULL,
          \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          INDEX \`Comment_authorId_idx\` (\`authorId\`),
          INDEX \`Comment_discussionId_idx\` (\`discussionId\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 5. relation_to_mandir
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`relation_to_mandir\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`relationship_name\` VARCHAR(191) NOT NULL,
          \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`relation_relationship_name_unique\` (\`relationship_name\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 6. TempleDevotee_registration
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`TempleDevotee_registration\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`first_name\` VARCHAR(191) NOT NULL,
          \`last_name\` VARCHAR(191) NOT NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`mobile\` VARCHAR(191) NOT NULL,
          \`password\` VARCHAR(255) NULL,
          \`status\` ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
          \`relation_id\` INT NOT NULL,
          \`mandir_id\` INT NOT NULL,
          \`subscription\` VARCHAR(10) NOT NULL DEFAULT 'No',
          \`reviewed_by_user_id\` INT NULL,
          \`reviewed_at\` DATETIME(3) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          INDEX \`templedevotee_reg_mandir_status_idx\` (\`mandir_id\`, \`status\`),
          INDEX \`templedevotee_reg_relation_status_idx\` (\`relation_id\`, \`status\`),
          INDEX \`templedevotee_reg_status_idx\` (\`status\`),
          INDEX \`templedevotee_reg_email_idx\` (\`email\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 7. blog_post
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`blog_post\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`title\` VARCHAR(191) NOT NULL,
          \`slug\` VARCHAR(191) NULL,
          \`category\` VARCHAR(191) NOT NULL,
          \`excerpt\` TEXT NOT NULL,
          \`content\` LONGTEXT NOT NULL,
          \`imageUrl\` VARCHAR(2048) NULL,
          \`author_name\` VARCHAR(191) NOT NULL,
          \`author_id\` INT NULL,
          \`status\` ENUM('Draft','Published','Archived') NOT NULL DEFAULT 'Draft',
          \`tags\` TEXT NULL,
          \`read_time\` VARCHAR(191) NULL,
          \`published_at\` DATETIME(3) NULL,
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`blog_post_slug_key\` (\`slug\`),
          INDEX \`blog_post_status_idx\` (\`status\`),
          INDEX \`blog_post_category_idx\` (\`category\`),
          INDEX \`blog_post_author_id_idx\` (\`author_id\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 8. community_group
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`community_group\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`name\` VARCHAR(191) NOT NULL,
          \`slug\` VARCHAR(191) NULL,
          \`category\` VARCHAR(191) NOT NULL,
          \`description\` TEXT NOT NULL,
          \`city_id\` INT NULL,
          \`city_name\` VARCHAR(191) NULL,
          \`meeting_info\` VARCHAR(191) NULL,
          \`contact_email\` VARCHAR(191) NULL,
          \`contact_phone\` VARCHAR(191) NULL,
          \`image_url\` VARCHAR(2048) NULL,
          \`creator_id\` INT NULL,
          \`creator_name\` VARCHAR(191) NULL,
          \`status\` ENUM('Active','Pending','Archived') NOT NULL DEFAULT 'Active',
          \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`community_group_slug_key\` (\`slug\`),
          INDEX \`community_group_status_idx\` (\`status\`),
          INDEX \`community_group_category_idx\` (\`category\`),
          INDEX \`community_group_city_id_idx\` (\`city_id\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // 9. community_group_member
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`community_group_member\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`group_id\` INT NOT NULL,
          \`user_id\` INT NULL,
          \`name\` VARCHAR(191) NOT NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`phone\` VARCHAR(191) NULL,
          \`role\` VARCHAR(50) NOT NULL DEFAULT 'Member',
          \`joined_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`group_email_unique\` (\`group_id\`, \`email\`),
          INDEX \`community_group_member_group_id_idx\` (\`group_id\`),
          INDEX \`community_group_member_user_id_idx\` (\`user_id\`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `);

      // Seed starter community groups if table is empty
      try {
        const existingCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM community_group');
        if (Number(existingCount[0]?.count || 0) === 0) {
          const starterGroups = [
            {
              name: 'Auckland Hindu Families',
              slug: 'auckland-hindu-families',
              category: 'Family',
              description: 'Connect with Hindu families across Auckland for playdates, cultural events, festival celebrations, and community support.',
              cityName: 'Auckland',
              meetingInfo: 'Every 2nd Saturday 10:30 AM',
              contactEmail: 'auckland.families@sanatan.org.nz',
              contactPhone: '+64 9 888 1234',
              creatorName: 'Auckland Community Coordinator',
              members: [
                { name: 'Pooja Sharma', email: 'pooja.sharma@sanatan.org.nz', role: 'Organizer' },
                { name: 'Amit Patel', email: 'amit.patel@sanatan.org.nz', role: 'Co-organizer' },
                { name: 'Rajesh Kumar', email: 'rajesh.k@sanatan.org.nz', role: 'Member' }
              ]
            },
            {
              name: 'Wellington Satsang & Bhajan Group',
              slug: 'wellington-satsang-bhajan',
              category: 'Satsang',
              description: 'Weekly devotional gatherings for kirtan, Vedic chanting, meditation, and spiritual discourses across the Wellington region.',
              cityName: 'Wellington',
              meetingInfo: 'Every Sunday 4:00 PM',
              contactEmail: 'wellington.satsang@sanatan.org.nz',
              contactPhone: '+64 4 888 5678',
              creatorName: 'Wellington Seva Circle',
              members: [
                { name: 'Sunil Rao', email: 'sunil.rao@sanatan.org.nz', role: 'Organizer' },
                { name: 'Geeta Nair', email: 'geeta.nair@sanatan.org.nz', role: 'Member' }
              ]
            },
            {
              name: 'Christchurch Youth Dharma Circle',
              slug: 'christchurch-youth-dharma',
              category: 'Youth',
              description: 'Empowering young Hindus and university students through discussions on dharma, Vedic philosophy, yoga, and cultural leadership.',
              cityName: 'Christchurch',
              meetingInfo: 'Fortnightly Saturdays 2:00 PM',
              contactEmail: 'youth.chch@sanatan.org.nz',
              contactPhone: '+64 3 888 9012',
              creatorName: 'Youth Seva Lead',
              members: [
                { name: 'Aarav Mehta', email: 'aarav.m@sanatan.org.nz', role: 'Organizer' },
                { name: 'Ananya Iyer', email: 'ananya.iyer@sanatan.org.nz', role: 'Member' }
              ]
            },
            {
              name: 'Hamilton Cultural & Seva Group',
              slug: 'hamilton-cultural-seva',
              category: 'Cultural & Seva',
              description: 'Organizing community volunteer seva, language classes, classical arts, and festive celebrations throughout the Waikato district.',
              cityName: 'Hamilton',
              meetingInfo: 'Monthly 1st Sunday 11:00 AM',
              contactEmail: 'hamilton.seva@sanatan.org.nz',
              contactPhone: '+64 7 888 3456',
              creatorName: 'Waikato Dharma Trust',
              members: [
                { name: 'Vikram Joshi', email: 'vikram.j@sanatan.org.nz', role: 'Organizer' },
                { name: 'Kavita Singh', email: 'kavita.singh@sanatan.org.nz', role: 'Member' }
              ]
            }
          ];

          for (const g of starterGroups) {
            await prisma.$executeRawUnsafe(`
              INSERT INTO \`community_group\` (\`name\`, \`slug\`, \`category\`, \`description\`, \`city_name\`, \`meeting_info\`, \`contact_email\`, \`contact_phone\`, \`creator_name\`, \`status\`, \`created_at\`, \`updated_at\`)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), NOW())
            `, g.name, g.slug, g.category, g.description, g.cityName, g.meetingInfo, g.contactEmail, g.contactPhone, g.creatorName);

            const inserted = await prisma.$queryRawUnsafe('SELECT id FROM community_group WHERE slug = ?', g.slug);
            const groupId = inserted[0]?.id;
            if (groupId && g.members) {
              for (const m of g.members) {
                await prisma.$executeRawUnsafe(`
                  INSERT INTO \`community_group_member\` (\`group_id\`, \`name\`, \`email\`, \`role\`, \`joined_at\`)
                  VALUES (?, ?, ?, ?, NOW())
                `, groupId, m.name, m.email, m.role);
              }
            }
          }
        }
      } catch (seedErr) {
        // Logging only; do not fail startup if seeding encounters conflict
        console.warn('Starter community groups seed check:', seedErr?.message);
      }

      // 10. Ensure business_business has imageUrl column
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE \`business_business\` ADD COLUMN \`imageUrl\` VARCHAR(2048) NULL;
        `);
      } catch {
        // Safe to ignore if column already exists
      }

      // 9. Auto-repair any double-encoded or slash-corrupted temple services/facilities in production
      try {
        const dirty = await prisma.$queryRawUnsafe(`
          SELECT id, service_offered, facilities_offered 
          FROM temple_temple 
          WHERE service_offered LIKE '%\\\\%' 
             OR service_offered LIKE '%[\\"[\\%'
             OR facilities_offered LIKE '%\\\\%'
             OR facilities_offered LIKE '%[\\"[\\%'
             OR service_offered LIKE '"[%'
             OR facilities_offered LIKE '"[%'
        `);

        if (Array.isArray(dirty) && dirty.length > 0) {
          const unwrapList = (val) => {
            const results = [];
            const unwrap = (v) => {
              if (v === null || v === undefined) return;
              if (Array.isArray(v)) { v.forEach(unwrap); return; }
              if (typeof v === 'string') {
                const trimmed = v.trim();
                if (!trimmed) return;
                if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                  try { unwrap(JSON.parse(trimmed)); return; } catch {}
                }
                const cleaned = trimmed.replace(/^[\[\]"'\\]+|[\[\]"'\\]+$/g, '').replace(/\\+["']/g, '').replace(/\\+/g, '').trim();
                if (cleaned) {
                  if (cleaned.includes(',')) cleaned.split(',').forEach(unwrap);
                  else results.push(cleaned);
                }
              } else { results.push(String(v).trim()); }
            };
            unwrap(val);
            return Array.from(new Set(results.map(s => s.trim()).filter(Boolean)));
          };

          for (const t of dirty) {
            const cleanServices = JSON.stringify(unwrapList(t.service_offered));
            const cleanFacilities = JSON.stringify(unwrapList(t.facilities_offered));
            await prisma.$executeRawUnsafe(
              'UPDATE temple_temple SET service_offered = ?, facilities_offered = ? WHERE id = ?',
              cleanServices,
              cleanFacilities,
              t.id
            );
          }
        }
      } catch {
        // Safe to ignore if table does not exist or columns not ready
      }
    })().catch((error) => {
      requiredTablesPromise = undefined;
      throw error;
    });
  }

  return requiredTablesPromise;
};

export const ensureEventAttendeeTable = () => ensureRequiredTables();
