import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { prisma, ensureRequiredTables } from '../src/config/db.js';
import { registerSchema } from '../src/validators/auth.validator.js';

test('Registration validator and Full Name resolution workflow', async () => {
  await ensureRequiredTables();

  // 1. Test validator with fullName
  const validPayload = {
    fullName: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    password: 'Password123!',
  };
  const parseResult = registerSchema.safeParse(validPayload);
  assert.ok(parseResult.success, 'registerSchema should succeed with fullName');
  assert.equal(parseResult.data.fullName, 'Arjun Sharma');

  // 2. Test validator requires name
  const invalidPayload = {
    email: 'noname@example.com',
    password: 'Password123!',
  };
  const invalidResult = registerSchema.safeParse(invalidPayload);
  assert.ok(!invalidResult.success, 'registerSchema should reject when fullName/username is missing');

  // 3. Test user creation with fullName mapped to username
  const testEmail = `fullname_test_${Date.now()}@example.com`;
  const resolvedFullName = 'Dr. Priya Ramanathan';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SecurePass123!', salt);

  const newUser = await prisma.user.create({
    data: {
      username: resolvedFullName,
      email: testEmail,
      passwordHash,
      role: 'User',
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  assert.ok(newUser.id, 'User record should be created');
  assert.equal(newUser.username, resolvedFullName);
  assert.equal(newUser.email, testEmail);

  // 4. Verify fetch
  const fetchedUser = await prisma.user.findUnique({
    where: { id: newUser.id },
  });
  assert.ok(fetchedUser, 'Should find user in database');
  assert.equal(fetchedUser.username, resolvedFullName);

  // 5. Clean up
  await prisma.user.delete({
    where: { id: newUser.id },
  });

  const deletedUser = await prisma.user.findUnique({
    where: { id: newUser.id },
  });
  assert.equal(deletedUser, null, 'User should be removed from database');
});
