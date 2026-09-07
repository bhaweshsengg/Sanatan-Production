import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fixing dirty service_offered / facilities_offered data...");

    // Get all temples
    const temples = await prisma.$queryRawUnsafe(`SELECT id, service_offered, facilities_offered FROM temple_temple`);
    console.log(`Found ${temples.length} temples to check.`);

    let fixed = 0;
    for (const temple of temples) {
      let needsUpdate = false;
      let newServiceOffered = temple.service_offered;
      let newFacilitiesOffered = temple.facilities_offered;

      // Fix service_offered
      if (typeof temple.service_offered === 'string') {
        const s = temple.service_offered.trim();
        if (s && !s.startsWith('[')) {
          // Convert plain/comma-separated to JSON array
          const items = s.split(',').map(i => i.trim()).filter(Boolean);
          newServiceOffered = JSON.stringify(items);
          needsUpdate = true;
          console.log(`  Temple ${temple.id}: service_offered "${s}" -> ${newServiceOffered}`);
        }
      }

      // Fix facilities_offered
      if (typeof temple.facilities_offered === 'string') {
        const f = temple.facilities_offered.trim();
        if (f && !f.startsWith('[')) {
          const items = f.split(',').map(i => i.trim()).filter(Boolean);
          newFacilitiesOffered = JSON.stringify(items);
          needsUpdate = true;
          console.log(`  Temple ${temple.id}: facilities_offered "${f}" -> ${newFacilitiesOffered}`);
        }
      }

      if (needsUpdate) {
        await prisma.$executeRawUnsafe(
          `UPDATE temple_temple SET service_offered = ?, facilities_offered = ? WHERE id = ?`,
          newServiceOffered,
          newFacilitiesOffered,
          temple.id
        );
        fixed++;
      }
    }

    console.log(`\nDone! Fixed ${fixed} temples.`);
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
