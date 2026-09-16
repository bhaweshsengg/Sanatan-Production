import test from 'node:test';
import assert from 'node:assert/strict';
import { templeUpdateSchema } from '../src/validators/temple.validator.js';

test('templeUpdateSchema preserves existing_images, role, contactRole, review without stripping', () => {
  const payload = {
    mandir_name: 'Test Mandir',
    city_id: 1,
    main_deity_id: 2,
    existing_images: ['uploads/old-image.jpg'],
    role: 'devotee',
    contactRole: 'Priest',
    review: '5',
  };

  const result = templeUpdateSchema.safeParse(payload);
  assert.equal(result.success, true, 'Validation should succeed');
  assert.equal(result.data.existing_images[0], 'uploads/old-image.jpg', 'existing_images array must be preserved');
  assert.equal(result.data.role, 'devotee', 'role must be preserved');
  assert.equal(result.data.contactRole, 'Priest', 'contactRole must be preserved');
  assert.equal(result.data.review, '5', 'review must be preserved');
});

test('templeUpdateSchema accepts string or empty string existing_images', () => {
  const result1 = templeUpdateSchema.safeParse({ existing_images: '' });
  assert.equal(result1.success, true);
  assert.equal(result1.data.existing_images, '');

  const result2 = templeUpdateSchema.safeParse({ existing_images: 'uploads/single.jpg' });
  assert.equal(result2.success, true);
  assert.equal(result2.data.existing_images, 'uploads/single.jpg');
});

test('templeUpdateSchema accepts placeholder email and website values such as Not available', () => {
  const result = templeUpdateSchema.safeParse({
    email: 'Not available',
    website: 'Not Available',
    your_email: ' admin@example.com ',
  });

  assert.equal(result.success, true, 'Validation must succeed for legacy/production placeholder email/website strings');
  assert.equal(result.data.email, 'Not available');
  assert.equal(result.data.website, 'Not Available');
  assert.equal(result.data.your_email, 'admin@example.com');
});

test('normalizeTempleRecord populates both camelCase and snake_case for city and deity IDs', async () => {
  const mockTemple = {
    id: 10,
    mandir_name: 'Shiva Mandir',
    cityId: 3,
    mainDeityId: 5,
    city: { id: 3, name: 'Wellington' },
    mainDeity: { id: 5, name: 'Lord Shiva' },
    images: [{ id: 1, file: '/uploads/sample.jpg' }],
    service_offered: '["daily_aarti"]',
    facilities_offered: '["parking"]',
  };

  const normalize = (temple) => ({
    ...temple,
    cityId: temple.cityId ?? temple.city_id,
    city_id: temple.cityId ?? temple.city_id,
    city: temple.city,
    mainDeityId: temple.mainDeityId ?? temple.main_deity_id,
    main_deity_id: temple.mainDeityId ?? temple.main_deity_id,
    mainDeity: temple.mainDeity,
    main_deity: temple.mainDeity,
  });

  const normalized = normalize(mockTemple);
  assert.equal(normalized.city_id, 3);
  assert.equal(normalized.cityId, 3);
  assert.equal(normalized.main_deity_id, 5);
  assert.equal(normalized.mainDeityId, 5);
  assert.equal(normalized.city.name, 'Wellington');
  assert.equal(normalized.main_deity.name, 'Lord Shiva');
});

test('updateTemple prunes old image and saves new image when editing', async () => {
  const { prisma } = await import('../src/config/db.js');
  const { updateTemple } = await import('../src/controllers/temple.controller.js');
  
  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();
  assert.ok(city, 'City should exist');
  assert.ok(deity, 'Deity should exist');
  
  const temple = await prisma.temple.create({
    data: {
      mandir_name: 'Test Temple For Image Replace',
      full_address: '123 Test Road',
      cityId: city.id,
      year_established: 2000,
      mainDeityId: deity.id,
      description: 'Testing image replacement',
      phone_no: '+64 9 000 0000',
      email: 'test@example.com',
      website: '',
      opening_hours: '08:00 - 18:00',
      service_offered: '["daily_aarti"]',
      facilities_offered: '["parking"]',
      your_name: 'Tester',
      your_email: 'tester@example.com',
      location: 'Test City',
      images: {
        create: [
          { file: '/uploads/old_test_image.jpg' }
        ]
      }
    },
    include: { images: true }
  });

  const oldImageId = temple.images[0].id;

  let responseStatus = 200;
  let responseData = null;
  const mockRes = {
    status(s) { responseStatus = s; return this; },
    json(payload) { responseData = payload; return this; }
  };

  const mockReq = {
    params: { id: String(temple.id) },
    body: {
      mandir_name: 'Updated Test Temple',
      existing_images: '',
    },
    files: [
      {
        originalname: 'new_temple_image.jpg',
        buffer: Buffer.from('fake image content'),
        mimetype: 'image/jpeg',
      }
    ]
  };

  await updateTemple(mockReq, mockRes);

  assert.equal(responseStatus, 200);
  assert.equal(responseData?.success, true);
  
  // Verify old image was removed from DB
  const oldImageCheck = await prisma.templeImage.findUnique({ where: { id: oldImageId } });
  assert.equal(oldImageCheck, null, 'Old image must be deleted from templeImage table');

  // Verify new image exists in DB
  const updatedTemple = await prisma.temple.findUnique({
    where: { id: temple.id },
    include: { images: true }
  });
  assert.equal(updatedTemple.images.length, 1, 'Temple should have exactly 1 image');
  assert.notEqual(updatedTemple.images[0].id, oldImageId, 'New image must have a different ID');

  // Cleanup test temple
  await prisma.templeImage.deleteMany({ where: { templeId: temple.id } });
  await prisma.temple.delete({ where: { id: temple.id } });
});

test('updateTemple unwraps and cleans deeply nested escaped service_offered and facilities_offered', async () => {
  const { prisma } = await import('../src/config/db.js');
  const { updateTemple } = await import('../src/controllers/temple.controller.js');

  const city = await prisma.city.findFirst();
  const deity = await prisma.deity.findFirst();

  const temple = await prisma.temple.create({

    data: {
      mandir_name: 'Test Nested Services Temple',
      full_address: '456 Nested Road',
      cityId: city.id,
      year_established: 2005,
      mainDeityId: deity.id,
      description: 'Testing nested services cleanup',
      phone_no: '+64 9 111 2222',
      email: 'nested@example.com',
      website: '',
      opening_hours: '09:00 - 17:00',
      service_offered: '["[\\"[\'\\\\\\\"daily Aarti\\\\\\\"\\\']\\"]"]',
      facilities_offered: '["[\\"[\'\\\\\\\"parking\\\\\\\"\\\']\\"]"]',
      your_name: 'Tester',
      your_email: 'tester@example.com',
      location: 'Test City',
    }
  });

  let responseStatus = 200;
  let responseData = null;
  const mockRes = {
    status(s) { responseStatus = s; return this; },
    json(payload) { responseData = payload; return this; }
  };

  const mockReq = {
    params: { id: String(temple.id) },
    body: {
      service_offered: ['["daily Aarti"]'],
      facilities_offered: ['parking', 'kitchen'],
    }
  };

  await updateTemple(mockReq, mockRes);

  assert.equal(responseStatus, 200);
  assert.equal(responseData?.success, true);
  assert.deepEqual(responseData?.data?.service_offered, ['daily Aarti']);
  assert.deepEqual(responseData?.data?.facilities_offered, ['parking', 'kitchen']);

  // Cleanup
  await prisma.temple.delete({ where: { id: temple.id } });
});

