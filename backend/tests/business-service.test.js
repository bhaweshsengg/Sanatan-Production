import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('Business/Service creation and retrieval workflow', async () => {
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
      status: 'Approved',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
      created_at: new Date(),
    },
  });

  assert.ok(created.id, 'Business/Service record should be created with an id');
  assert.equal(created.category, 'Priest / Purohit / Pandit Services');
  assert.equal(created.ownerName, 'Rajesh Sharma');
  assert.equal(created.status, 'Approved');

  // Verify fetch
  const fetched = await prisma.business.findUnique({
    where: { id: created.id },
  });

  assert.ok(fetched, 'Should find the created service in database');
  assert.equal(fetched.email, testEmail);
  assert.equal(fetched.imageUrl, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800');

  // Clean up
  await prisma.business.delete({
    where: { id: created.id },
  });
});
