import test from 'node:test';
import assert from 'node:assert/strict';
import { eventCreateSchema, isFestivalCategory } from '../src/validators/event.validator.js';

test('isFestivalCategory correctly identifies festival categories', () => {
  assert.equal(isFestivalCategory('Festival'), true);
  assert.equal(isFestivalCategory('Major Festival'), true);
  assert.equal(isFestivalCategory('Religious Observance'), true);
  assert.equal(isFestivalCategory('Community Festival Celebration'), true);
  assert.equal(isFestivalCategory('festival'), true);

  // Non-festival categories
  assert.equal(isFestivalCategory('Pooja'), false);
  assert.equal(isFestivalCategory('Havan/Yagna'), false);
  assert.equal(isFestivalCategory('Bhajan/Kirtan'), false);
  assert.equal(isFestivalCategory('Spiritual Discourse'), false);
  assert.equal(isFestivalCategory('Cultural Program'), false);
  assert.equal(isFestivalCategory('Youth Event'), false);
  assert.equal(isFestivalCategory('Other'), false);
  assert.equal(isFestivalCategory(''), false);
  assert.equal(isFestivalCategory(null), false);
});

test('Regular events require Temple Name', () => {
  const regularEventWithoutTemple = {
    title: 'Weekly Sunday Satsang & Bhajan',
    category: 'Bhajan/Kirtan',
    description: 'Weekly devotional bhajan gathering for community peace, spiritual wellbeing, and meditation.',
    eventDate: '2026-11-15',
    startTime: '10:00',
    endTime: '12:00',
    termsAccepted: true,
    templeName: '',
  };

  const result = eventCreateSchema.safeParse(regularEventWithoutTemple);
  assert.equal(result.success, false);
  const templeError = result.error.issues.find(i => i.path.includes('templeName'));
  assert.ok(templeError, 'Should have validation error on templeName');
  assert.match(templeError.message, /Temple Name is required for regular events/);

  // With templeName provided, regular event passes
  const regularEventWithTemple = {
    ...regularEventWithoutTemple,
    templeName: 'Auckland Shiv Mandir',
    templeId: 1,
  };
  const validResult = eventCreateSchema.safeParse(regularEventWithTemple);
  assert.equal(validResult.success, true);
});

test('Festival events allow Temple selection to be optional when Community is selected', () => {
  const festivalWithCommunityOnly = {
    title: 'Holi Festival of Colours Celebration',
    category: 'Festival',
    description: 'Annual vibrant spring celebration of colours, unity, friendship, music, prasad, and joyous community spirit.',
    eventDate: '2026-03-24',
    startTime: '11:00',
    endTime: '16:00',
    termsAccepted: true,
    templeName: '', // Temple omitted!
    templeId: null, // No temple selected!
    communityName: 'Wellington Indian Community Group',
    communityId: 4,
    address: 'Frank Kitts Park, Wellington Waterfront',
  };

  const result = eventCreateSchema.safeParse(festivalWithCommunityOnly);
  assert.equal(result.success, true, 'Festival with community only must pass validation');
  assert.equal(result.data.communityName, 'Wellington Indian Community Group');
  assert.equal(result.data.templeId, null);
});

test('Festival events allow Temple selection when Mandir is chosen', () => {
  const festivalWithTemple = {
    title: 'Maha Shivaratri Jagran & Aarti',
    category: 'Major Festival',
    description: 'Sacred night of Lord Shiva with continuous abhishek, chants, bhajans, bilva leaves offering, and midnight maha aarti.',
    eventDate: '2026-02-15',
    startTime: '18:00',
    endTime: '06:00',
    termsAccepted: true,
    templeName: 'Shri Ram Mandir Henderson',
    templeId: 2,
    hallName: 'Main Prayer Hall',
    address: '11 Brick Street, Henderson, Auckland',
  };

  const result = eventCreateSchema.safeParse(festivalWithTemple);
  assert.equal(result.success, true);
  assert.equal(result.data.templeName, 'Shri Ram Mandir Henderson');
  assert.equal(result.data.templeId, 2);
});

test('Festival events require at least Community, Temple, or location address', () => {
  const festivalWithoutAnyLocation = {
    title: 'Community Deepavali Gathering',
    category: 'Festival',
    description: 'Celebrating the festival of lights with lamps, devotional songs, prasad, and traditional blessings for all families.',
    eventDate: '2026-11-08',
    startTime: '17:00',
    endTime: '21:00',
    termsAccepted: true,
    templeName: '',
    communityName: '',
    address: '',
  };

  const result = eventCreateSchema.safeParse(festivalWithoutAnyLocation);
  assert.equal(result.success, false);
  const locationError = result.error.issues.find(i => i.path.includes('templeName'));
  assert.ok(locationError);
  assert.match(locationError.message, /Please select a Community or Temple/);
});
