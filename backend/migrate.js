import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
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
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`Discussion_authorId_idx\` (\`authorId\`),
        INDEX \`Discussion_cityId_idx\` (\`cityId\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

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

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`relation_to_mandir\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`relationship_name\` VARCHAR(191) NOT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`relation_relationship_name_unique\` (\`relationship_name\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`user_mandir_registration\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`first_name\` VARCHAR(191) NOT NULL,
        \`last_name\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL,
        \`mobile\` VARCHAR(191) NOT NULL,
        \`status\` ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
        \`relation_id\` INT NOT NULL,
        \`mandir_id\` INT NOT NULL,
        \`reviewed_by_user_id\` INT NULL,
        \`reviewed_at\` DATETIME(3) NULL,
        \`notes\` TEXT NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`user_mandir_reg_mandir_status_idx\` (\`mandir_id\`, \`status\`),
        INDEX \`user_mandir_reg_relation_status_idx\` (\`relation_id\`, \`status\`),
        INDEX \`user_mandir_reg_status_idx\` (\`status\`),
        INDEX \`user_mandir_reg_email_idx\` (\`email\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
