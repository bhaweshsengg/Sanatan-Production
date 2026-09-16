import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const parseListField = (value) => {
  const results = [];

  const unwrap = (val) => {
    if (val === null || val === undefined) return;

    if (Array.isArray(val)) {
      for (const item of val) {
        unwrap(item);
      }
      return;
    }

    if (typeof val === 'string') {
      let trimmed = val.trim();
      if (!trimmed) return;

      let parsed = false;
      if (
        (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith('{') && trimmed.endsWith('}'))
      ) {
        try {
          const parsedVal = JSON.parse(trimmed);
          unwrap(parsedVal);
          parsed = true;
        } catch {
          // fall through
        }
      }

      if (!parsed) {
        const cleaned = trimmed
          .replace(/^[\[\]"'\\]+|[\[\]"'\\]+$/g, '')
          .replace(/\\+["']/g, '')
          .replace(/\\+/g, '')
          .trim();

        if (cleaned) {
          if (cleaned.includes(',')) {
            cleaned.split(',').forEach((part) => unwrap(part));
          } else {
            results.push(cleaned);
          }
        }
      }
    } else {
      results.push(String(val).trim());
    }
  };

  unwrap(value);
  return Array.from(new Set(results.map((s) => s.trim()).filter(Boolean)));
};

async function main() {
  try {
    console.log("Fixing dirty/double-encoded service_offered and facilities_offered data...");

    const temples = await prisma.$queryRawUnsafe(`SELECT id, mandir_name, service_offered, facilities_offered FROM temple_temple`);
    console.log(`Found ${temples.length} temples to check.`);

    let fixed = 0;
    for (const temple of temples) {
      const cleanServices = parseListField(temple.service_offered || []);
      const cleanFacilities = parseListField(temple.facilities_offered || []);

      const newServiceOffered = JSON.stringify(cleanServices);
      const newFacilitiesOffered = JSON.stringify(cleanFacilities);

      if (
        newServiceOffered !== temple.service_offered ||
        newFacilitiesOffered !== temple.facilities_offered
      ) {
        console.log(`  Temple ${temple.id} (${temple.mandir_name}):`);
        console.log(`    services: ${temple.service_offered} -> ${newServiceOffered}`);
        console.log(`    facilities: ${temple.facilities_offered} -> ${newFacilitiesOffered}`);

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
