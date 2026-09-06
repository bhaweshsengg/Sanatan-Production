import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting data standardization migration...");

    // 1. DATA-04: Convert Temple arrays to JSON
    // MySQL handles this conversion smoothly if the string is valid JSON
    console.log("Converting temple_temple.service_offered to JSON...");
    await prisma.$executeRawUnsafe(`ALTER TABLE temple_temple MODIFY service_offered JSON;`);
    
    console.log("Converting temple_temple.facilities_offered to JSON...");
    await prisma.$executeRawUnsafe(`ALTER TABLE temple_temple MODIFY facilities_offered JSON;`);

    // 2. DATA-03: Convert Event dates to DATETIME
    console.log("Converting Event.eventDate to DATETIME...");
    // Update empty strings or nulls to a safe default or valid date if necessary to prevent strict mode errors
    await prisma.$executeRawUnsafe(`UPDATE Event SET eventDate = '2000-01-01 00:00:00' WHERE eventDate = '' OR eventDate IS NULL;`);
    // Attempt conversion
    await prisma.$executeRawUnsafe(`ALTER TABLE Event MODIFY eventDate DATETIME;`);

    console.log("Converting Event.endDate to DATETIME...");
    // First make it nullable if not already, then set empty to NULL
    await prisma.$executeRawUnsafe(`UPDATE Event SET endDate = NULL WHERE endDate = '';`);
    await prisma.$executeRawUnsafe(`ALTER TABLE Event MODIFY endDate DATETIME NULL;`);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
