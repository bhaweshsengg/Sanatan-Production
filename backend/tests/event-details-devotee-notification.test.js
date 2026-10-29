import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureRequiredTables, ensureEventCommunityColumns } from '../src/config/db.js';
import { notifyDevoteesForTempleEvent } from '../src/controllers/event.controller.js';

test('Devotee registration status endpoint logic and duplicate check', async (t) => {
  await ensureRequiredTables().catch(() => {});
  await ensureEventCommunityColumns().catch(() => {});

  const testEmail = `devotee_test_${Date.now()}@example.com`;

  // Find or use an existing approved temple
  const temple = await prisma.temple.findFirst({
    where: { status: 'Approved' },
  });
  assert.ok(temple, 'Should find at least one approved temple');

  const secondTemple = await prisma.temple.findFirst({
    where: { status: 'Approved', id: { not: temple.id } },
  });

  // Find an active relation
  let relation = await prisma.relationToMandir.findFirst({
    where: { isActive: true },
  });
  if (!relation) {
    relation = await prisma.relationToMandir.create({
      data: { relationshipName: `Devotee_${Date.now()}`, isActive: true },
    });
  }

  // Create an approved registration for temple 1
  const reg1 = await prisma.templeDevoteeRegistration.create({
    data: {
      firstName: 'Ramesh',
      lastName: 'Sharma',
      email: testEmail,
      mobile: '+64 21 000 1111',
      subscription: 'Yes',
      status: 'Approved',
      mandirId: temple.id,
      relationId: relation.id,
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    },
  });
  assert.ok(reg1.id > 0, 'Devotee registration should be created');

  // Verify finding approved registration for temple 1
  const foundReg1 = await prisma.templeDevoteeRegistration.findFirst({
    where: { email: testEmail, mandirId: temple.id },
  });
  assert.ok(foundReg1, 'Should find devotee registration for temple 1');
  assert.equal(foundReg1.status, 'Approved');

  // Verify registration for second temple is permitted (different temple)
  if (secondTemple) {
    const reg2 = await prisma.templeDevoteeRegistration.create({
      data: {
        firstName: 'Ramesh',
        lastName: 'Sharma',
        email: testEmail,
        mobile: '+64 21 000 1111',
        subscription: 'No',
        status: 'Pending',
        mandirId: secondTemple.id,
        relationId: relation.id,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });
    assert.ok(reg2.id > 0, 'Should allow registering for a different temple');

    // Clean up reg2
    await prisma.templeDevoteeRegistration.delete({ where: { id: reg2.id } }).catch(() => {});
  }

  // Test devotee email notification helper safely handles events
  await t.test('notifyDevoteesForTempleEvent safely executes without errors', async () => {
    const mockEvent = {
      id: 999999,
      title: 'Diwali Maha Celebration',
      category: 'Festival',
      eventDate: '2026-11-01',
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      templeId: temple.id,
      templeName: temple.mandir_name,
      description: 'Grand Diwali celebrations with Maha Aarti and Prasad.',
      hallName: 'Main Prayer Hall',
    };

    // notifyDevoteesForTempleEvent should execute smoothly without throwing
    await assert.doesNotReject(async () => {
      await notifyDevoteesForTempleEvent(mockEvent);
    });
  });

  // Clean up reg1
  await prisma.templeDevoteeRegistration.delete({ where: { id: reg1.id } }).catch(() => {});
});
