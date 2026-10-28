import assert from 'node:assert/strict';
import { prisma } from '../src/config/db.js';

async function testFestivalApi() {
  const baseUrl = 'http://localhost:4000/api/v1';

  console.log('1. Testing GET /api/v1/event?limit=all&category=Festival...');
  const res1 = await fetch(`${baseUrl}/event?limit=all&category=Festival`);
  assert.equal(res1.status, 200);
  const data1 = await res1.json();
  console.log(`   Initial approved festival count: ${data1.data?.length ?? 0}`);

  const traditions = ['Hindu', 'Jain', 'Sikh', 'Baudh'];
  const createdIds = [];

  for (const tradition of traditions) {
    console.log(`2. Creating festival with tradition: ${tradition}...`);
    const createRes = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Test ${tradition} Deepotsav & Celebration 2026`,
        category: tradition,
        description: `Sacred ${tradition} community festival celebrating devotion, heritage, shared prayers, sacred music, and mahaprasad for all devotees across New Zealand.`,
        eventDate: '2026-10-25',
        startTime: '10:00',
        endTime: '15:00',
        templeName: 'Sanatan Community',
        termsAccepted: true,
      }),
    });

    assert.equal(createRes.status, 201, `Creation failed for ${tradition}`);
    const createdData = await createRes.json();
    assert.equal(createdData.data.category, tradition);
    createdIds.push(createdData.data.id);
    console.log(`   -> Created ID: ${createdData.data.id}, Category in DB: ${createdData.data.category}`);

    // Approve the event in the database so it appears in listApprovedEvents
    await prisma.event.update({
      where: { id: createdData.data.id },
      data: { status: 'Approved' },
    });
  }

  console.log('3. Verifying GET /api/v1/event?limit=all&category=Festival includes all created Dharma festivals...');
  const resFestivals = await fetch(`${baseUrl}/event?limit=all&category=Festival`);
  assert.equal(resFestivals.status, 200);
  const dataFestivals = await resFestivals.json();
  const returnedIds = (dataFestivals.data || []).map((e) => e.id);

  for (const id of createdIds) {
    assert.ok(returnedIds.includes(id), `Festival ID ${id} was not returned in festival query list`);
  }
  console.log('   -> All created Dharma tradition festivals properly returned under category=Festival!');

  console.log('4. Verifying direct filtering by tradition (category=Baudh)...');
  const resBaudh = await fetch(`${baseUrl}/event?category=Baudh`);
  assert.equal(resBaudh.status, 200);
  const dataBaudh = await resBaudh.json();
  assert.ok(dataBaudh.data.every((e) => e.category === 'Baudh'), 'All results should have category Baudh');
  assert.ok(dataBaudh.data.some((e) => createdIds.includes(e.id)), 'Should include our newly created Baudh event');
  console.log(`   -> Successfully retrieved Baudh festivals.`);

  console.log('5. Verifying direct filtering by tradition (category=Jain)...');
  const resJain = await fetch(`${baseUrl}/event?category=Jain`);
  assert.equal(resJain.status, 200);
  const dataJain = await resJain.json();
  assert.ok(dataJain.data.every((e) => e.category === 'Jain'), 'All results should have category Jain');
  assert.ok(dataJain.data.some((e) => createdIds.includes(e.id)), 'Should include our newly created Jain event');
  console.log(`   -> Successfully retrieved Jain festivals.`);

  console.log('6. Verifying editing / updating festival category directly...');
  const testId = createdIds[0];
  await prisma.event.update({
    where: { id: testId },
    data: { category: 'Jain' },
  });
  const updatedDb = await prisma.event.findUnique({ where: { id: testId } });
  assert.equal(updatedDb.category, 'Jain', 'Category should update to Jain');
  console.log(`   -> Successfully updated festival #${testId} category to Jain in database.`);

  console.log('7. Cleaning up test event records...');
  await prisma.event.deleteMany({
    where: { id: { in: createdIds } },
  });
  console.log('   -> Cleaned up test records.');

  console.log('\n--- ALL FESTIVAL API INTEGRATION & DB TESTS PASSED SUCCESSFULLY! ---');
  await prisma.$disconnect();
}

testFestivalApi().catch(async (err) => {
  console.error('API Test Error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
