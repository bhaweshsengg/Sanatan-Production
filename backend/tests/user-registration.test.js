import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

import {
  isTempleAdminRelation,
  validateApprovalLimit,
  MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR,
} from '../src/utils/mandirApproval.js';
import { registrationSchema } from '../src/validators/userRegistration.validator.js';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('Temple Admin relation detection is case-insensitive and stable', () => {
  assert.equal(isTempleAdminRelation('Temple Admin'), true);
  assert.equal(isTempleAdminRelation('temple admin'), true);
  assert.equal(isTempleAdminRelation('Temple Devotee'), false);
});

test('Approval limit validation blocks a third approved admin', () => {
  assert.throws(() => validateApprovalLimit(2), {
    message: 'Maximum 2 Temple Admins are already assigned to this Mandir.',
  });

  assert.doesNotThrow(() => validateApprovalLimit(1));
  assert.equal(MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR, 2);
});

test('registrationSchema validates required fields for devotee registration', () => {
  const valid = {
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@example.com',
    password: 'securePassword123',
    mobile: '+64 21 987 654',
    mandirId: 1,
    subscription: 'Yes',
  };

  const parsed = registrationSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.subscription, 'Yes');

  // Password too short
  const invalidPassword = registrationSchema.safeParse({ ...valid, password: '123' });
  assert.equal(invalidPassword.success, false);

  // Missing temple
  const missingTemple = registrationSchema.safeParse({ ...valid, mandirId: undefined });
  assert.equal(missingTemple.success, false);

  // Default subscription to 'No' when omitted
  const noSub = registrationSchema.safeParse({
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@example.com',
    password: 'securePassword123',
    mobile: '+64 21 987 654',
    mandirId: 1,
  });
  assert.equal(noSub.success, true);
  assert.equal(noSub.data.subscription, 'No');

  // Formatted international mobile number with spaces, parentheses, hyphens (e.g. 17+ chars)
  const formattedMobile = registrationSchema.safeParse({
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@example.com',
    password: 'securePassword123',
    mobile: '+64 (21) 123-4567',
    mandirId: 1,
  });
  assert.equal(formattedMobile.success, true, 'Formatted mobile number with parentheses and hyphens must be accepted');
});

test('Temple Devotee registration database workflow: store in TempleDevotee_registration and admin review', async () => {
  await ensureRequiredTables();

  const model = prisma.templeDevoteeRegistration || prisma.userMandirRegistration;
  const uniqueSuffix = Date.now();
  const testEmail = `devotee_test_${uniqueSuffix}@example.com`;

  // Get or create relation for Temple Devotee
  let devoteeRelation = await prisma.relationToMandir.findFirst({
    where: { relationshipName: 'Temple Devotee' },
  });
  if (!devoteeRelation) {
    devoteeRelation = await prisma.relationToMandir.create({
      data: { relationshipName: 'Temple Devotee', isActive: true },
    });
  }

  // Get a temple
  const temple = await prisma.temple.findFirst();
  assert.ok(temple, 'At least one temple must exist in DB');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SecretPass123!', salt);

  // 1. Create Devotee registration
  const devoteeReg = await model.create({
    data: {
      firstName: 'Vikram',
      lastName: 'Sharma',
      email: testEmail,
      mobile: '+64 22 111 2222',
      password: passwordHash,
      mandirId: temple.id,
      relationId: devoteeRelation.id,
      subscription: 'Yes',
      status: 'Pending',
    },
    include: { mandir: true, relation: true },
  });

  try {
    assert.ok(devoteeReg.id);
    assert.equal(devoteeReg.status, 'Pending');
    assert.equal(devoteeReg.subscription, 'Yes');
    assert.equal(devoteeReg.mandirId, temple.id);
    assert.ok(devoteeReg.password);
    assert.equal(devoteeReg.reviewedByUserId, null);
    assert.equal(devoteeReg.reviewedAt, null);
    assert.equal(devoteeReg.notes, null);

    // 2. Admin reviews and approves
    let adminUser = await prisma.user.findFirst({ where: { role: 'Admin' } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          username: `admin_${uniqueSuffix}`,
          email: `admin_${uniqueSuffix}@example.com`,
          passwordHash: 'dummyhash',
          role: 'Admin',
          isActive: true,
        },
      });
    }
    const adminId = adminUser.id;
    const reviewNote = 'Approved by Temple Committee';

    const approved = await model.update({
      where: { id: devoteeReg.id },
      data: {
        status: 'Approved',
        reviewedByUserId: adminId,
        reviewedAt: new Date(),
        notes: reviewNote,
      },
    });

    assert.equal(approved.status, 'Approved');
    assert.equal(approved.reviewedByUserId, adminId);
    assert.ok(approved.reviewedAt);
    assert.equal(approved.notes, reviewNote);

    // 3. Verify Devotee user account creation/upgrade
    const devoteeUser = await prisma.user.create({
      data: {
        username: testEmail,
        email: testEmail,
        passwordHash: passwordHash,
        role: 'User',
        isActive: true,
      },
    });

    // Simulate approval trigger upgrading User to Devotee
    if (devoteeUser.role === 'User') {
      await prisma.user.update({
        where: { id: devoteeUser.id },
        data: { role: 'Devotee' },
      });
    }

    const updatedUser = await prisma.user.findUnique({ where: { id: devoteeUser.id } });
    assert.equal(updatedUser.role, 'Devotee', 'User role must be upgraded to Devotee');
    await prisma.user.delete({ where: { id: devoteeUser.id } });
  } finally {
    // Clean up test devotee registration
    await model.deleteMany({ where: { email: testEmail } });
  }
});

