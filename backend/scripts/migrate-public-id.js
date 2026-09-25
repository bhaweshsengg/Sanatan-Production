import { prisma } from '../src/config/db.js';
import { generateCuid } from '../src/utils/cuid.js';

export async function migratePublicIds() {
  console.log('--- Starting Temple publicId Migration ---');

  // 1. Ensure public_id column exists
  try {
    const cols = await prisma.$queryRawUnsafe('DESCRIBE temple_temple');
    const hasPublicIdCol = cols.some((c) => c.Field === 'public_id' || c.Field === 'publicId');
    if (!hasPublicIdCol) {
      console.log('Adding public_id column to temple_temple table...');
      await prisma.$executeRawUnsafe(
        'ALTER TABLE `temple_temple` ADD COLUMN `public_id` VARCHAR(191) NULL;'
      );
      console.log('Column public_id added successfully.');
    } else {
      console.log('Column public_id already exists in temple_temple.');
    }
  } catch (err) {
    console.warn('Column check/addition note:', err.message);
  }

  // 2. Fetch all temples without a valid public_id
  const unmigratedTemples = await prisma.$queryRawUnsafe(
    'SELECT id, mandir_name, public_id FROM `temple_temple` WHERE `public_id` IS NULL OR `public_id` = \'\''
  );

  console.log(`Found ${unmigratedTemples.length} temples needing publicId generation.`);

  let migratedCount = 0;
  for (const temple of unmigratedTemples) {
    const cuid = generateCuid();
    await prisma.$executeRawUnsafe(
      'UPDATE `temple_temple` SET `public_id` = ? WHERE `id` = ?',
      cuid,
      temple.id
    );
    migratedCount++;
    console.log(`[${migratedCount}/${unmigratedTemples.length}] Temple #${temple.id} "${temple.mandir_name}" assigned publicId: ${cuid}`);
  }

  // 3. Ensure unique index on public_id
  try {
    const indexes = await prisma.$queryRawUnsafe('SHOW INDEX FROM `temple_temple` WHERE Column_name = \'public_id\'');
    if (!indexes || indexes.length === 0) {
      console.log('Creating unique index on public_id...');
      await prisma.$executeRawUnsafe(
        'ALTER TABLE `temple_temple` ADD UNIQUE INDEX `temple_temple_public_id_key` (`public_id`);'
      );
      console.log('Unique index created.');
    } else {
      console.log('Unique index on public_id already exists.');
    }
  } catch (idxErr) {
    console.warn('Index check/creation note:', idxErr.message);
  }

  // 4. Verify total temples and public_id presence
  const totalWithPublicId = await prisma.$queryRawUnsafe(
    'SELECT COUNT(*) as count FROM `temple_temple` WHERE `public_id` IS NOT NULL AND `public_id` != \'\''
  );
  const count = Number(totalWithPublicId[0]?.count || 0);
  console.log(`--- Migration Complete: ${count} temples verified with unique publicId ---`);
  return { migratedCount, totalWithPublicId: count };
}

if (process.argv[1]?.endsWith('migrate-public-id.js')) {
  migratePublicIds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
