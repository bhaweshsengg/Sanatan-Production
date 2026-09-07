import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Drop unique index on email column so multiple temples can share an email
    await prisma.$executeRawUnsafe(`ALTER TABLE temple_temple DROP INDEX temple_temple_email_key`);
    console.log('SUCCESS: Unique constraint on email dropped.');
  } catch (e) {
    if (e.message && (e.message.includes("check that it exists") || e.message.includes("Duplicate"))) {
      console.log('Constraint does not exist or already removed — OK.');
    } else {
      console.log('Error:', e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
