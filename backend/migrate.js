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

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
