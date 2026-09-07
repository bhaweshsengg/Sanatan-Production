import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedRelations = [
  'Temple Admin',
  'Temples Coordinator',
  'Temple Devotee',
];

async function main() {
  for (const relationshipName of seedRelations) {
    await prisma.relationToMandir.upsert({
      where: { relationshipName },
      update: { isActive: true },
      create: { relationshipName, isActive: true },
    });
  }

  console.log('Seeded mandir relationship options.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
