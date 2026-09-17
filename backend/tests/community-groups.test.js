import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGroupSchema,
  updateGroupSchema,
  joinGroupSchema,
} from '../src/validators/communityGroup.validator.js';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('createGroupSchema validates required fields', () => {
  const valid = {
    name: 'Taranaki Hindu Community Group',
    category: 'Cultural & Seva',
    description: 'A community group for families and devotees across New Plymouth and the Taranaki region.',
    cityName: 'New Plymouth',
    meetingInfo: 'Monthly 2nd Sunday',
    contactEmail: 'taranaki.hindu@example.com',
  };

  const parsed = createGroupSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.name, 'Taranaki Hindu Community Group');

  // Name too short
  const invalidName = createGroupSchema.safeParse({ ...valid, name: 'Hi' });
  assert.equal(invalidName.success, false);

  // Description too short
  const invalidDesc = createGroupSchema.safeParse({ ...valid, description: 'Short' });
  assert.equal(invalidDesc.success, false);
});

test('joinGroupSchema validates name and email format', () => {
  const valid = {
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+64 21 000 1111',
  };

  const parsed = joinGroupSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.role, 'Member');

  const invalidEmail = joinGroupSchema.safeParse({ ...valid, email: 'not-an-email' });
  assert.equal(invalidEmail.success, false);
});

test('Community Group and Members Database Lifecycle', async () => {
  await ensureRequiredTables();

  const testSlug = `test-group-${Date.now()}`;
  const testEmail = `tester.${Date.now()}@example.com`;

  // 1. Insert test group
  await prisma.$executeRawUnsafe(`
    INSERT INTO community_group (name, slug, category, description, city_name, meeting_info, contact_email, status, created_at, updated_at)
    VALUES ('Automated Test Group', ?, 'Youth', 'This is a test group for automated testing of community hub.', 'Auckland', 'Weekly Saturdays', ?, 'Active', NOW(), NOW())
  `, testSlug, testEmail);

  const insertedGroups = await prisma.$queryRawUnsafe('SELECT id, name FROM community_group WHERE slug = ?', testSlug);
  assert.equal(insertedGroups.length, 1);
  const groupId = Number(insertedGroups[0].id);

  // 2. Add member
  await prisma.$executeRawUnsafe(`
    INSERT INTO community_group_member (group_id, name, email, role, joined_at)
    VALUES (?, 'Test Member', ?, 'Member', NOW())
  `, groupId, testEmail);

  const members = await prisma.$queryRawUnsafe('SELECT * FROM community_group_member WHERE group_id = ?', groupId);
  assert.equal(members.length, 1);
  assert.equal(members[0].name, 'Test Member');

  // 3. Duplicate join check
  const duplicate = await prisma.$queryRawUnsafe(
    'SELECT id FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?',
    groupId,
    testEmail.toLowerCase()
  );
  assert.equal(duplicate.length, 1, 'Duplicate check identifies existing member');

  // 4. Leave group
  await prisma.$executeRawUnsafe('DELETE FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?', groupId, testEmail.toLowerCase());
  const afterLeave = await prisma.$queryRawUnsafe('SELECT * FROM community_group_member WHERE group_id = ?', groupId);
  assert.equal(afterLeave.length, 0);

  // 5. Cleanup test group
  await prisma.$executeRawUnsafe('DELETE FROM community_group WHERE id = ?', groupId);
});
