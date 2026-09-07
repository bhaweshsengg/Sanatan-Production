import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Adding new roles to User enum in DB...");
    await prisma.$executeRawUnsafe(`ALTER TABLE User MODIFY role ENUM('Admin', 'TempleManager', 'BusinessManager', 'User', 'Devotee', 'Priest') DEFAULT 'User';`);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
