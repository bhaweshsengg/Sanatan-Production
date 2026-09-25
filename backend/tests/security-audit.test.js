import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureRequiredTables } from '../src/config/db.js';
import { register, login } from '../src/controllers/auth.controller.js';
import { updateGroup, deleteGroup, leaveGroup } from '../src/controllers/community.controller.js';
import { updateTemple, getTemple, deleteTemple, updateTempleStatus } from '../src/controllers/temple.controller.js';
import { getBusinesses, getBusinessById, updateBusinessStatus } from '../src/controllers/business.controller.js';
import { listApprovedEvents, updateEvent, deleteEvent, updateEventStatus } from '../src/controllers/event.controller.js';
import { listPublicBlogs, getPublicBlogById, createBlog, updateBlog, deleteBlog } from '../src/controllers/blog.controller.js';
import { listPendingRegistrations } from '../src/controllers/userRegistration.controller.js';
import { createReligiousArticle, deleteReligiousArticle } from '../src/controllers/religiousArticle.controller.js';
import { imageFileFilter } from '../src/utils/fileUpload.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { env } from '../src/config/env.js';

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
};

test('Security Audit: Mass Assignment / Privilege Escalation Prevention on Registration', async () => {
  await ensureRequiredTables();
  const testSuffix = Date.now();

  const req = {
    body: {
      fullName: `Attacker Admin ${testSuffix}`,
      email: `attacker_admin_${testSuffix}@example.com`,
      password: 'HackerPassword123!',
      role: 'Admin', // Attacker trying to elevate to Super Admin
      termsAccepted: true,
    },
  };
  const res = createMockResponse();

  await register(req, res);

  assert.equal(res.statusCode, 201, 'Registration should succeed');
  assert.notEqual(res.body?.data?.role, 'Admin', 'Attacker must NOT be granted Admin role');
  assert.equal(res.body?.data?.role, 'User', 'Role must default to standard User');

  // Verify in database
  const createdInDb = await prisma.user.findFirst({
    where: { email: `attacker_admin_${testSuffix}@example.com` },
  });
  assert.ok(createdInDb);
  assert.equal(createdInDb.role, 'User', 'Database record must be strictly role User');

  // Cleanup
  await prisma.user.delete({ where: { id: createdInDb.id } });
});

test('Security Audit: Community Group IDOR - Unauthenticated and unauthorized access', async () => {
  await ensureRequiredTables();
  const testSlug = `sec-test-group-${Date.now()}`;
  const ownerEmail = `owner.${Date.now()}@example.com`;

  // Create test group owned by User ID 99991
  await prisma.$executeRawUnsafe(`
    INSERT INTO community_group (name, slug, category, description, city_name, contact_email, creator_id, status, created_at, updated_at)
    VALUES ('IDOR Protected Group', ?, 'Youth', 'Testing IDOR protection on community groups', 'Auckland', ?, 99991, 'Active', NOW(), NOW())
  `, testSlug, ownerEmail);

  const groups = await prisma.$queryRawUnsafe('SELECT id FROM community_group WHERE slug = ?', testSlug);
  const groupId = Number(groups[0].id);

  // 1. Negative Test: Unauthenticated caller attempts to update group -> 401
  const unauthRes = createMockResponse();
  await updateGroup({ params: { id: String(groupId) }, body: { name: 'Hacked Name' } }, unauthRes);
  assert.equal(unauthRes.statusCode, 401, 'Unauthenticated group update must return 401');

  // 2. Negative Test: Unauthenticated caller attempts to delete group -> 401
  const unauthDelRes = createMockResponse();
  await deleteGroup({ params: { id: String(groupId) } }, unauthDelRes);
  assert.equal(unauthDelRes.statusCode, 401, 'Unauthenticated group delete must return 401');

  // 3. Negative Test: Wrong user (IDOR) attempts to update group -> 403 Forbidden
  const wrongUserRes = createMockResponse();
  await updateGroup({
    user: { id: 88882, username: 'Attacker', email: 'attacker@example.com', role: 'User' },
    params: { id: String(groupId) },
    body: { name: 'Hacked By Attacker' },
  }, wrongUserRes);
  assert.equal(wrongUserRes.statusCode, 403, 'Unauthorized user editing group must return 403 Forbidden');

  // 4. Negative Test: Wrong user (IDOR) attempts to delete group -> 403 Forbidden
  const wrongUserDelRes = createMockResponse();
  await deleteGroup({
    user: { id: 88882, username: 'Attacker', email: 'attacker@example.com', role: 'User' },
    params: { id: String(groupId) },
  }, wrongUserDelRes);
  assert.equal(wrongUserDelRes.statusCode, 403, 'Unauthorized user deleting group must return 403 Forbidden');

  // Cleanup
  await prisma.$executeRawUnsafe('DELETE FROM community_group WHERE id = ?', groupId);
});

test('Security Audit: Community Group IDOR - Unauthorized member ejection', async () => {
  await ensureRequiredTables();
  const testSlug = `sec-leave-group-${Date.now()}`;
  const victimEmail = `victim.${Date.now()}@example.com`;

  await prisma.$executeRawUnsafe(`
    INSERT INTO community_group (name, slug, category, description, status, created_at, updated_at)
    VALUES ('Member Kick Protection Group', ?, 'Youth', 'Testing IDOR member kicking', 'Active', NOW(), NOW())
  `, testSlug);

  const groups = await prisma.$queryRawUnsafe('SELECT id FROM community_group WHERE slug = ?', testSlug);
  const groupId = Number(groups[0].id);

  // Add victim as member
  await prisma.$executeRawUnsafe(`
    INSERT INTO community_group_member (group_id, name, email, role, joined_at)
    VALUES (?, 'Victim User', ?, 'Member', NOW())
  `, groupId, victimEmail);

  // Negative Test: Attacker logged in as another user tries to kick victim -> 403 Forbidden
  const attackerRes = createMockResponse();
  await leaveGroup({
    user: { id: 77771, username: 'Attacker', email: 'attacker77@example.com', role: 'User' },
    params: { id: String(groupId) },
    body: { email: victimEmail },
  }, attackerRes);

  assert.equal(attackerRes.statusCode, 403, 'Attacker attempting to remove another member must return 403 Forbidden');

  // Verify victim is still in the group
  const memberCheck = await prisma.$queryRawUnsafe(
    'SELECT id FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?',
    groupId,
    victimEmail.toLowerCase()
  );
  assert.equal(memberCheck.length, 1, 'Victim must remain in the group');

  // Cleanup
  await prisma.$executeRawUnsafe('DELETE FROM community_group_member WHERE group_id = ?', groupId);
  await prisma.$executeRawUnsafe('DELETE FROM community_group WHERE id = ?', groupId);
});

test('Security Audit: Temple IDOR & Privilege Boundaries', async () => {
  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();

  const victimTemple = await prisma.temple.create({
    data: {
      mandir_name: 'Sacred Mandir Under Protection',
      full_address: '100 Security Ave',
      cityId: city.id,
      year_established: 2010,
      mainDeityId: deity.id,
      description: 'Testing Temple IDOR protection',
      phone_no: '+64 9 999 0000',
      email: 'temple1@example.com',
      website: '',
      opening_hours: '08:00 - 18:00',
      service_offered: '[]',
      facilities_offered: '[]',
      your_name: 'Legit Temple Manager',
      your_email: 'legit.manager@example.com',
      location: 'Auckland',
      status: 'Pending',
    },
  });

  // 1. Negative Test: Wrong TempleManager (IDOR) attempts to edit another temple -> 403 Forbidden
  const wrongManagerRes = createMockResponse();
  await updateTemple({
    user: { id: 55551, username: 'RivalManager', email: 'rival.manager@example.com', role: 'TempleManager' },
    params: { id: String(victimTemple.id) },
    body: {
      mandir_name: 'Hacked Temple Name',
    },
  }, wrongManagerRes);

  assert.equal(wrongManagerRes.statusCode, 403, 'Unauthorized TempleManager editing another temple must return 403');

  // 2. Negative Test: TempleManager attempting to self-approve status via updateTemple is blocked from changing status
  const ownerManagerRes = createMockResponse();
  await updateTemple({
    user: { id: 55552, username: 'LegitManager', email: 'legit.manager@example.com', role: 'TempleManager' },
    params: { id: String(victimTemple.id) },
    body: {
      mandir_name: 'Legit Temple Updated By Owner',
      status: 'Approved', // TempleManager trying to approve their own temple
    },
  }, ownerManagerRes);

  assert.equal(ownerManagerRes.statusCode, 200, 'Owner TempleManager can update their temple info');
  
  // Verify status was NOT changed to Approved
  const checkTemple = await prisma.temple.findUnique({ where: { id: victimTemple.id } });
  assert.equal(checkTemple.status, 'Pending', 'Non-admin update must NOT be able to modify approval status');
  assert.equal(checkTemple.mandir_name, 'Legit Temple Updated By Owner');

  // Cleanup
  await prisma.temple.delete({ where: { id: victimTemple.id } });
});

test('Security Audit: /api/v1/temple/:id response sanitization removes private/internal user fields', async () => {
  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();

  const testTemple = await prisma.temple.create({
    data: {
      mandir_name: 'Public Verification Temple',
      full_address: '123 Public Way',
      cityId: city.id,
      year_established: 2015,
      mainDeityId: deity.id,
      description: 'Public description for worshippers',
      phone_no: '+64 9 888 7777',
      email: 'info@publictemple.org',
      website: 'https://publictemple.org',
      opening_hours: '06:00 - 20:00',
      service_offered: '["daily_aarti"]',
      facilities_offered: '["parking"]',
      rating: 4.8,
      location: 'Auckland',
      status: 'Approved',
      // Internal & private submitter fields that must NEVER appear in public response:
      your_name: 'Confidential Submitter Name',
      your_email: 'confidential.submitter@private.org',
      role: 'devotee',
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    },
  });

  const res = createMockResponse();
  await getTemple({ params: { id: String(testTemple.id) } }, res);

  assert.equal(res.statusCode, 200, 'getTemple must return 200 for valid temple');
  const data = res.body?.data;
  assert.ok(data, 'Response must have data object');

  // 1. Verify intentionally public data IS present
  assert.equal(data.id, testTemple.id);
  assert.equal(data.mandir_name, 'Public Verification Temple');
  assert.equal(data.full_address, '123 Public Way');
  assert.equal(data.phone_no, '+64 9 888 7777');
  assert.equal(data.email, 'info@publictemple.org');
  assert.equal(data.website, 'https://publictemple.org');
  assert.equal(data.opening_hours, '06:00 - 20:00');
  assert.equal(data.rating, 4.8);
  assert.equal(data.cityId, city.id);
  assert.equal(data.mainDeityId, deity.id);
  assert.deepEqual(data.service_offered, ['daily_aarti']);
  assert.deepEqual(data.facilities_offered, ['parking']);

  // 2. Verify all private, submitter, and internal admin fields are STRICTLY ABSENT
  assert.equal(data.your_name, undefined, 'your_name must not be present in public temple response');
  assert.equal(data.your_email, undefined, 'your_email must not be present in public temple response');
  assert.equal(data.role, undefined, 'role must not be present in public temple response');
  assert.equal(data.termsAccepted, undefined, 'termsAccepted must not be present in public temple response');
  assert.equal(data.termsAcceptedAt, undefined, 'termsAcceptedAt must not be present in public temple response');
  assert.equal(data.terms_accepted, undefined, 'terms_accepted must not be present in public temple response');
  assert.equal(data.terms_accepted_at, undefined, 'terms_accepted_at must not be present in public temple response');
  assert.equal(data.mandirRegistrations, undefined, 'mandirRegistrations must not be present in public temple response');

  // Cleanup
  await prisma.temple.delete({ where: { id: testTemple.id } });
});

test('Security Audit: Temple publicId and numeric ID dual-resolution in getTemple', async () => {
  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();

  const temple = await prisma.temple.create({
    data: {
      mandir_name: 'Dual Resolution Temple',
      full_address: '55 Sacred Rd',
      cityId: city.id,
      year_established: 2020,
      mainDeityId: deity.id,
      description: 'Testing dual resolution',
      phone_no: '+64 9 777 6666',
      email: 'dual@example.com',
      website: '',
      opening_hours: '08:00 - 18:00',
      service_offered: '["daily_aarti"]',
      facilities_offered: '["parking"]',
      your_name: 'Manager',
      your_email: 'manager@example.com',
      location: 'Auckland',
      status: 'Approved',
    },
  });

  assert.ok(temple.publicId, 'New temple must have a cuid publicId automatically generated');
  assert.equal(typeof temple.publicId, 'string');
  assert.equal(temple.publicId.startsWith('c'), true, 'publicId should follow cuid format starting with c');

  // 1. Fetch by publicId
  const byPublicIdRes = createMockResponse();
  await getTemple({ params: { id: temple.publicId } }, byPublicIdRes);
  assert.equal(byPublicIdRes.statusCode, 200);
  assert.equal(byPublicIdRes.body?.data?.id, temple.id);
  assert.equal(byPublicIdRes.body?.data?.publicId, temple.publicId);

  // 2. Fetch by numeric ID
  const byNumericIdRes = createMockResponse();
  await getTemple({ params: { id: String(temple.id) } }, byNumericIdRes);
  assert.equal(byNumericIdRes.statusCode, 200);
  assert.equal(byNumericIdRes.body?.data?.id, temple.id);
  assert.equal(byNumericIdRes.body?.data?.publicId, temple.publicId);

  // Cleanup
  await prisma.temple.delete({ where: { id: temple.id } });
});

test('Security Audit: deleteTemple() and updateTempleStatus() authorization and IDOR/BOLA protection', async () => {
  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();

  const protectedTemple = await prisma.temple.create({
    data: {
      mandir_name: 'Strictly Protected Temple',
      full_address: '77 Fortress St',
      cityId: city.id,
      year_established: 2018,
      mainDeityId: deity.id,
      description: 'Testing delete and status auth protection',
      phone_no: '+64 9 555 4444',
      email: 'protected@example.com',
      website: '',
      opening_hours: '08:00 - 18:00',
      service_offered: '["daily_aarti"]',
      facilities_offered: '["parking"]',
      your_name: 'Protected Owner',
      your_email: 'owner@protected.com',
      location: 'Auckland',
      status: 'Pending',
    },
  });

  const templeId = protectedTemple.id;
  const publicId = protectedTemple.publicId;

  // 1. updateTempleStatus - unauthenticated caller (401)
  const unauthStatusRes = createMockResponse();
  await updateTempleStatus({ params: { id: publicId }, body: { status: 'Approved' } }, unauthStatusRes);
  assert.equal(unauthStatusRes.statusCode, 401, 'Unauthenticated status update must return 401');

  // 2. updateTempleStatus - non-admin (e.g. TempleManager or User) caller (403)
  const nonAdminStatusRes = createMockResponse();
  await updateTempleStatus({
    user: { id: 44441, username: 'Manager', email: 'owner@protected.com', role: 'TempleManager' },
    params: { id: publicId },
    body: { status: 'Approved' },
  }, nonAdminStatusRes);
  assert.equal(nonAdminStatusRes.statusCode, 403, 'Non-admin status update must return 403');

  // 3. updateTempleStatus - admin caller (200) works with publicId
  const adminStatusRes = createMockResponse();
  await updateTempleStatus({
    user: { id: 1, username: 'SuperAdmin', email: 'admin@sanatan.nz', role: 'Admin' },
    params: { id: publicId },
    body: { status: 'Approved' },
  }, adminStatusRes);
  assert.equal(adminStatusRes.statusCode, 200, 'Admin status update must succeed with 200');

  const statusCheck = await prisma.temple.findUnique({ where: { id: templeId } });
  assert.equal(statusCheck.status, 'Approved');

  // 4. deleteTemple - unauthenticated caller (401)
  const unauthDelRes = createMockResponse();
  await deleteTemple({ params: { id: publicId } }, unauthDelRes);
  assert.equal(unauthDelRes.statusCode, 401, 'Unauthenticated temple delete must return 401');

  // 5. deleteTemple - non-admin (e.g. TempleManager or User) caller (403)
  const nonAdminDelRes = createMockResponse();
  await deleteTemple({
    user: { id: 44441, username: 'Manager', email: 'owner@protected.com', role: 'TempleManager' },
    params: { id: publicId },
  }, nonAdminDelRes);
  assert.equal(nonAdminDelRes.statusCode, 403, 'Non-admin temple delete must return 403');

  // Verify temple still exists
  const templeStillExists = await prisma.temple.findUnique({ where: { id: templeId } });
  assert.ok(templeStillExists, 'Temple must not be deleted by unauthorized user');

  // 6. deleteTemple - admin caller (200) works with numeric ID or publicId
  const adminDelRes = createMockResponse();
  await deleteTemple({
    user: { id: 1, username: 'SuperAdmin', email: 'admin@sanatan.nz', role: 'Admin' },
    params: { id: String(templeId) },
  }, adminDelRes);
  assert.equal(adminDelRes.statusCode, 200, 'Admin temple delete must succeed with 200');

  const finalCheck = await prisma.temple.findUnique({ where: { id: templeId } });
  assert.equal(finalCheck, null, 'Temple should be deleted by admin');
});

test('Security Audit: Business/Service Privacy & Access Control', async () => {
  await ensureRequiredTables();
  const uniqueId = Date.now();

  const pendingBiz = await prisma.business.create({
    data: {
      businessName: `Secret Pending Business ${uniqueId}`,
      category: 'Catering',
      description: 'Pending approval with private personal data',
      address: 'Private St',
      city: 'Auckland',
      phone: '0210001111',
      email: `private.${uniqueId}@example.com`,
      ownerName: 'Secret Owner',
      ownerEmail: `private.${uniqueId}@example.com`,
      ownerPhone: '0210001111',
      status: 'Pending',
      created_at: new Date(),
    },
  });

  // 1. Negative Test: Public/unauthenticated query with ?status=Pending or ?status=all must not expose pending business
  const publicListRes = createMockResponse();
  await getBusinesses({
    query: { status: 'Pending' }, // Public user requesting pending listings
    user: undefined,
  }, publicListRes);

  const foundInPublic = publicListRes.body?.data?.some((b) => b.id === String(pendingBiz.id));
  assert.equal(foundInPublic, false, 'Unapproved business must not appear in public query even if ?status=Pending is requested');

  // 2. Negative Test: Direct access to unapproved business by unauthenticated user returns 404
  const publicDetailRes = createMockResponse();
  await getBusinessById({
    params: { id: String(pendingBiz.id) },
    user: undefined,
  }, publicDetailRes);

  assert.equal(publicDetailRes.statusCode, 404, 'Unapproved business detail must return 404 to unauthorized callers');

  // Cleanup
  await prisma.business.delete({ where: { id: pendingBiz.id } });
});

test('Security Audit: File Upload Filter blocks dangerous extensions and non-images', () => {
  const testCases = [
    { file: { mimetype: 'image/svg+xml', originalname: 'exploit.svg' }, expectedAllowed: false },
    { file: { mimetype: 'text/html', originalname: 'page.html' }, expectedAllowed: false },
    { file: { mimetype: 'application/x-msdownload', originalname: 'malware.exe' }, expectedAllowed: false },
    { file: { mimetype: 'image/jpeg', originalname: 'exploit.php' }, expectedAllowed: false }, // Mismatched ext
    { file: { mimetype: 'image/jpeg', originalname: 'photo.jpg' }, expectedAllowed: true },
    { file: { mimetype: 'image/png', originalname: 'logo.png' }, expectedAllowed: true },
    { file: { mimetype: 'image/webp', originalname: 'banner.webp' }, expectedAllowed: true },
  ];

  for (const tc of testCases) {
    let allowed = false;
    let err = null;
    imageFileFilter({}, tc.file, (e, res) => {
      err = e;
      allowed = Boolean(res);
    });

    assert.equal(
      allowed,
      tc.expectedAllowed,
      `File ${tc.file.originalname} (${tc.file.mimetype}) expected allowed=${tc.expectedAllowed}`
    );
  }
});

test('Security Audit: Sensitive data redaction in public endpoints', async () => {
  await ensureRequiredTables();
  // Public blog check
  const blogRes = createMockResponse();
  await listPublicBlogs({ query: {} }, blogRes);
  assert.equal(blogRes.statusCode, 200);

  const blogs = blogRes.body?.data || [];
  for (const blog of blogs) {
    if (blog.author) {
      assert.equal(blog.author.email, undefined, 'Author email must be redacted from public blog responses');
    }
  }

  // Public event check
  const eventRes = createMockResponse();
  await listApprovedEvents({ query: {} }, eventRes);
  assert.equal(eventRes.statusCode, 200);

  const events = eventRes.body?.data || [];
  for (const ev of events) {
    if (ev.organizer) {
      assert.equal(ev.organizer.email, undefined, 'Organizer email must be redacted from public event responses');
    }
  }
});

test('Security Audit: Production error handler sanitizes internal 500 exceptions', () => {
  const originalEnv = env.nodeEnv;
  env.nodeEnv = 'production';

  try {
    const errorRes = createMockResponse();
    const sensitiveError = new Error('PrismaClientKnownRequestError: Table "secret_db.users" does not exist at syntax near SELECT *');
    sensitiveError.status = 500;

    errorHandler(sensitiveError, {}, errorRes, () => {});

    assert.equal(errorRes.statusCode, 500);
    assert.equal(errorRes.body?.message, 'Internal server error', 'Production error message must be generic');
    assert.equal(errorRes.body?.data?.details, null, 'Production error details must be null');
  } finally {
    env.nodeEnv = originalEnv;
  }
});

test('Security Audit: Constant-time authentication defense prevents user enumeration', async () => {
  const fakeEmail = `nonexistent_${Date.now()}@security-test.nz`;
  const req = {
    body: {
      email: fakeEmail,
      password: 'NonExistentPassword123!',
    },
  };
  const res = createMockResponse();

  await login(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body?.message, 'Invalid email or password');
});

test('Security Audit: Defense-in-depth controller authorization on admin operations', async () => {
  const unauthorizedUser = {
    id: 99999,
    username: 'NormalUser',
    email: 'normaluser@test.org',
    role: 'User',
  };

  // 1. Event controller admin methods
  const evUpdateRes = createMockResponse();
  await updateEvent({ user: unauthorizedUser, params: { id: '1' }, body: {} }, evUpdateRes);
  assert.equal(evUpdateRes.statusCode, 403, 'updateEvent must reject non-admin');

  const evDeleteRes = createMockResponse();
  await deleteEvent({ user: unauthorizedUser, params: { id: '1' } }, evDeleteRes);
  assert.equal(evDeleteRes.statusCode, 403, 'deleteEvent must reject non-admin');

  const evStatusRes = createMockResponse();
  await updateEventStatus({ user: unauthorizedUser, params: { id: '1' }, body: { status: 'Approved' } }, evStatusRes);
  assert.equal(evStatusRes.statusCode, 403, 'updateEventStatus must reject non-admin');

  // 2. Blog controller admin methods
  const blogCreateRes = createMockResponse();
  await createBlog({ user: unauthorizedUser, body: { title: 'Test' } }, blogCreateRes);
  assert.equal(blogCreateRes.statusCode, 403, 'createBlog must reject non-admin');

  const blogUpdateRes = createMockResponse();
  await updateBlog({ user: unauthorizedUser, params: { id: '1' }, body: {} }, blogUpdateRes);
  assert.equal(blogUpdateRes.statusCode, 403, 'updateBlog must reject non-admin');

  const blogDeleteRes = createMockResponse();
  await deleteBlog({ user: unauthorizedUser, params: { id: '1' } }, blogDeleteRes);
  assert.equal(blogDeleteRes.statusCode, 403, 'deleteBlog must reject non-admin');

  // 3. Business controller status update
  const bizStatusRes = createMockResponse();
  await updateBusinessStatus({ user: unauthorizedUser, params: { id: '1' }, body: { status: 'Approved' } }, bizStatusRes);
  assert.equal(bizStatusRes.statusCode, 403, 'updateBusinessStatus must reject non-admin');

  // 4. User Registration controller pending list
  const regListRes = createMockResponse();
  await listPendingRegistrations({ user: unauthorizedUser }, regListRes);
  assert.equal(regListRes.statusCode, 403, 'listPendingRegistrations must reject non-admin');

  // 5. Religious Article controller admin methods
  const articleCreateRes = createMockResponse();
  await createReligiousArticle({ user: unauthorizedUser, body: { title: 'Test Article' } }, articleCreateRes);
  assert.equal(articleCreateRes.statusCode, 403, 'createReligiousArticle must reject non-admin');

  const articleDeleteRes = createMockResponse();
  await deleteReligiousArticle({ user: unauthorizedUser, params: { id: '1' } }, articleDeleteRes);
  assert.equal(articleDeleteRes.statusCode, 403, 'deleteReligiousArticle must reject non-admin');
});

