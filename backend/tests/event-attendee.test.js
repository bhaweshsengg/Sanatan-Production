import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureEventAttendeeTable } from '../src/config/db.js';

test('Event Attendee Flow: join, duplicate check, leave, and attendee list', async () => {
  await ensureEventAttendeeTable();

  // Create or get a test user
  const uniqueSuffix = Date.now();
  const testUser = await prisma.user.create({
    data: {
      username: `testdevotee_${uniqueSuffix}`,
      email: `devotee_${uniqueSuffix}@example.com`,
      passwordHash: 'dummyhash',
      role: 'User',
      isActive: true,
    }
  });

  // Create a test event
  const testEvent = await prisma.event.create({
    data: {
      title: `Festival of Lights ${uniqueSuffix}`,
      category: 'Festival',
      description: 'Annual festival celebration',
      eventDate: '2026-11-12',
      startTime: '18:00',
      endTime: '21:00',
      templeName: 'Auckland Central Mandir',
      status: 'Approved',
      attendees: 0,
    }
  });

  try {
    // 1. Initial attendees count should be 0
    assert.equal(testEvent.attendees, 0);

    // 2. User joins event
    await prisma.eventAttendee.create({
      data: {
        eventId: testEvent.id,
        userId: testUser.id,
        name: testUser.username,
        email: testUser.email,
      }
    });

    const countAfterJoin = await prisma.eventAttendee.count({
      where: { eventId: testEvent.id }
    });
    assert.equal(countAfterJoin, 1);

    await prisma.event.update({
      where: { id: testEvent.id },
      data: { attendees: countAfterJoin }
    });

    const updatedEvent = await prisma.event.findUnique({
      where: { id: testEvent.id }
    });
    assert.equal(updatedEvent.attendees, 1);

    // 3. Duplicate join attempt should fail unique constraint
    await assert.rejects(
      async () => {
        await prisma.eventAttendee.create({
          data: {
            eventId: testEvent.id,
            userId: testUser.id,
            name: testUser.username,
            email: testUser.email,
          }
        });
      },
      /Unique constraint failed/
    );

    // Count must remain 1
    const countAfterDuplicate = await prisma.eventAttendee.count({
      where: { eventId: testEvent.id }
    });
    assert.equal(countAfterDuplicate, 1);

    // 4. Admin query: fetch attendees list
    const attendees = await prisma.eventAttendee.findMany({
      where: { eventId: testEvent.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
          }
        }
      }
    });

    assert.equal(attendees.length, 1);
    assert.equal(attendees[0].name, testUser.username);
    assert.equal(attendees[0].email, testUser.email);
    assert.equal(attendees[0].user.role, 'User');
    assert.ok(attendees[0].joinedAt instanceof Date);

    // 5. User leaves event
    await prisma.eventAttendee.deleteMany({
      where: {
        eventId: testEvent.id,
        userId: testUser.id,
      }
    });

    const countAfterLeave = await prisma.eventAttendee.count({
      where: { eventId: testEvent.id }
    });
    assert.equal(countAfterLeave, 0);

    await prisma.event.update({
      where: { id: testEvent.id },
      data: { attendees: countAfterLeave }
    });

    const eventAfterLeave = await prisma.event.findUnique({
      where: { id: testEvent.id }
    });
    assert.equal(eventAfterLeave.attendees, 0);

  } finally {
    // Cleanup test data
    await prisma.eventAttendee.deleteMany({ where: { eventId: testEvent.id } });
    await prisma.event.delete({ where: { id: testEvent.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
  }
});
