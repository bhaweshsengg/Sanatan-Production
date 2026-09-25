import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('Business/Service creation, fee, social media, and appointment request workflow', async () => {
  await ensureRequiredTables();

  const testEmail = `service_test_${Date.now()}@example.com`;
  const created = await prisma.business.create({
    data: {
      businessName: 'Sharma Vedic Purohit Services',
      category: 'Priest / Purohit / Pandit Services',
      description: 'Experienced Vedic priest available for Griha Pravesh, Satyanarayan Katha, and Weddings.',
      address: '123 Dominion Road',
      city: 'Auckland',
      phone: '+64 21 123 4567',
      email: testEmail,
      ownerName: 'Rajesh Sharma',
      ownerEmail: testEmail,
      ownerPhone: '+64 21 123 4567',
      services: 'Griha Pravesh, Vivah Samskara, Satyanarayan Puja',
      operatingHours: 'Mon-Sun: 7:00 AM - 8:00 PM',
      specialOffers: 'Complimentary consultation for first-time families',
      facebookUrl: 'https://facebook.com/sharmapurohit',
      instagramUrl: 'https://instagram.com/sharmapurohit',
      twitterUrl: 'https://x.com/sharmapurohit',
      linkedInUrl: 'https://linkedin.com/in/sharmapurohit',
      fee: '$101 NZD',
      status: 'Pending',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
      created_at: new Date(),
    },
  });

  assert.ok(created.id, 'Business/Service record should be created with an id');
  assert.equal(created.category, 'Priest / Purohit / Pandit Services');
  assert.equal(created.ownerName, 'Rajesh Sharma');
  assert.equal(created.status, 'Pending');
  assert.equal(created.fee, '$101 NZD');
  assert.equal(created.linkedInUrl, 'https://linkedin.com/in/sharmapurohit');

  // Verify fetch
  const fetched = await prisma.business.findUnique({
    where: { id: created.id },
  });

  assert.ok(fetched, 'Should find the created service in database');
  assert.equal(fetched.email, testEmail);
  assert.equal(fetched.fee, '$101 NZD');
  assert.equal(fetched.linkedInUrl, 'https://linkedin.com/in/sharmapurohit');
  assert.equal(fetched.services, 'Griha Pravesh, Vivah Samskara, Satyanarayan Puja');

  // Test service appointment creation
  await prisma.$executeRawUnsafe(
    `INSERT INTO service_appointment (business_id, name, email, phone, preferred_date, preferred_time, notes, service_name, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
    created.id,
    'Devotee Ramesh Patel',
    'ramesh.patel@example.com',
    '+64 21 999 8888',
    '2026-10-15',
    '10:00 AM',
    'Griha Pravesh Puja at new home',
    'Griha Pravesh'
  );

  const appointments = await prisma.$queryRawUnsafe(
    'SELECT * FROM service_appointment WHERE business_id = ?',
    created.id
  );

  assert.ok(Array.isArray(appointments) && appointments.length === 1, 'Should record appointment');
  assert.equal(appointments[0].name, 'Devotee Ramesh Patel');
  assert.equal(appointments[0].email, 'ramesh.patel@example.com');
  assert.equal(appointments[0].service_name, 'Griha Pravesh');

  // Clean up
  await prisma.$executeRawUnsafe('DELETE FROM service_appointment WHERE business_id = ?', created.id);
  await prisma.business.delete({
    where: { id: created.id },
  });
});

test('Service registration and details flow preserves both Mobile and Phone Number', async () => {
  await ensureRequiredTables();
  const { createBusiness, getBusinessById } = await import('../src/controllers/business.controller.js');

  const uniqueId = Date.now();
  const testEmail = `contact_flow_${uniqueId}@example.com`;
  const mobileInput = '+64 21 555 1234';
  const phoneInput = '+64 9 555 5678';

  let createStatusCode = 200;
  let createResponseBody = null;
  const mockRes = {
    status(code) {
      createStatusCode = code;
      return this;
    },
    json(body) {
      createResponseBody = body;
      return this;
    },
  };

  await createBusiness({
    user: { role: 'Admin', email: testEmail },
    body: {
      firstName: 'Vedic',
      lastName: 'Astrologer',
      category: 'Astrology & Horoscope',
      description: 'Expert Vedic horoscope guidance',
      address: '123 Queen Street',
      city: 'Auckland',
      mobile: mobileInput,
      phoneNo: phoneInput,
      phone: phoneInput,
      email: testEmail,
      termsAccepted: 'true',
      status: 'Approved',
    },
  }, mockRes);

  assert.equal(createStatusCode, 201, 'Should create service successfully');
  assert.ok(createResponseBody?.data?.id, 'Should return created service ID');
  assert.equal(createResponseBody.data.mobile, mobileInput, 'Created response must return mobile');
  assert.equal(createResponseBody.data.phone, phoneInput, 'Created response must return phone');
  assert.equal(createResponseBody.data.phoneNo, phoneInput, 'Created response must return phoneNo');

  const createdId = createResponseBody.data.id;

  // Now verify getBusinessById returns both mobile and phone
  let getStatusCode = 200;
  let getResponseBody = null;
  const mockGetRes = {
    status(code) {
      getStatusCode = code;
      return this;
    },
    json(body) {
      getResponseBody = body;
      return this;
    },
  };

  await getBusinessById({
    params: { id: createdId },
    user: { role: 'User', email: 'public@example.com' },
  }, mockGetRes);

  assert.equal(getStatusCode, 200, 'Should fetch service details');
  assert.equal(getResponseBody.data.mobile, mobileInput, 'Details must return mobile');
  assert.equal(getResponseBody.data.phone, phoneInput, 'Details must return phone');
  assert.equal(getResponseBody.data.phoneNo, phoneInput, 'Details must return phoneNo');
  assert.equal(getResponseBody.data.ownerPhone, mobileInput, 'Details must return ownerPhone as mobile');

  // Clean up
  await prisma.business.delete({
    where: { id: BigInt(createdId) },
  });
});
