import { prisma } from '../src/config/db.js';

async function main() {
  console.log('Checking and updating TempleDevotee_registration columns...');
  try {
    // Ensure user table is InnoDB for foreign key compatibility
    await prisma.$executeRawUnsafe('ALTER TABLE `user` ENGINE=InnoDB');

    // 1. Check if password column exists
    const passwordCol = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'templedevotee_registration' 
        AND COLUMN_NAME = 'password'
    `);

    if (passwordCol.length === 0) {
      console.log('Adding password column to TempleDevotee_registration...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`templedevotee_registration\` 
        ADD COLUMN \`password\` VARCHAR(255) NULL AFTER \`mobile\`
      `);
      console.log('Added password column.');
    } else {
      console.log('password column already exists.');
    }

    // 2. Check if subscription column exists
    const subCol = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'templedevotee_registration' 
        AND COLUMN_NAME = 'subscription'
    `);

    if (subCol.length === 0) {
      console.log('Adding subscription column to TempleDevotee_registration...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`templedevotee_registration\` 
        ADD COLUMN \`subscription\` VARCHAR(10) NOT NULL DEFAULT 'No' AFTER \`mandir_id\`
      `);
      console.log('Added subscription column.');
    } else {
      console.log('subscription column already exists.');
    }

    // 3. Verify columns
    const cols = await prisma.$queryRawUnsafe('DESCRIBE `templedevotee_registration`');
    console.log('Updated columns in TempleDevotee_registration:', cols.map(c => c.Field));
  } catch (error) {
    console.error('Error migrating columns:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
