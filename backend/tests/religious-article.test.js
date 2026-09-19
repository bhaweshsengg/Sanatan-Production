import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('Religious article table seeding, CRUD, and status toggle workflow', async () => {
  await ensureRequiredTables();

  // 1. Verify starter articles seeded
  const initialArticles = await prisma.$queryRawUnsafe(
    "SELECT * FROM religious_article WHERE status = 'Published'"
  );
  assert.ok(initialArticles.length >= 7, 'Should have at least 7 starter religious articles');

  // 2. Insert a new religious article
  const testTitle = `Test Shanti Mantra ${Date.now()}`;
  await prisma.$executeRawUnsafe(
    `INSERT INTO religious_article (
      title, sanskrit_title, category, deity, source,
      summary, sanskrit_text, transliteration, english_meaning,
      significance, best_time_to_chant, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published', NOW(), NOW())`,
    testTitle,
    'शान्ति मन्त्र',
    'Mantras',
    'Universal Peace',
    'Upanishad',
    'A universal prayer invoking peace across all realms of existence.',
    'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥',
    'Oṁ Asato Mā Sad-Gamaya | Tamaso Mā Jyotir-Gamaya | Mṛtyor-Mā Amṛtaṁ Gamaya ||',
    'Lead us from the unreal to the real, from darkness to light, from death to immortality.',
    'Chanted for universal harmony, mental serenity, and spiritual awakening.',
    'Morning meditation and closing of spiritual gatherings'
  );

  const inserted = await prisma.$queryRawUnsafe(
    'SELECT * FROM religious_article WHERE title = ?',
    testTitle
  );
  assert.ok(inserted && inserted.length > 0, 'Created article should be found in database');
  const articleId = inserted[0].id;
  assert.equal(inserted[0].category, 'Mantras');
  assert.equal(inserted[0].status, 'Published');

  // 3. Update the article
  await prisma.$executeRawUnsafe(
    'UPDATE religious_article SET category = ?, summary = ?, updated_at = NOW() WHERE id = ?',
    'Philosophy',
    'Updated summary for universal prayer.',
    articleId
  );

  const updated = await prisma.$queryRawUnsafe(
    'SELECT * FROM religious_article WHERE id = ?',
    articleId
  );
  assert.equal(updated[0].category, 'Philosophy');
  assert.equal(updated[0].summary, 'Updated summary for universal prayer.');

  // 4. Toggle status to Draft
  await prisma.$executeRawUnsafe(
    'UPDATE religious_article SET status = ?, updated_at = NOW() WHERE id = ?',
    'Draft',
    articleId
  );

  const draftCheck = await prisma.$queryRawUnsafe(
    'SELECT * FROM religious_article WHERE id = ?',
    articleId
  );
  assert.equal(draftCheck[0].status, 'Draft');

  // 5. Clean up
  await prisma.$executeRawUnsafe(
    'DELETE FROM religious_article WHERE id = ?',
    articleId
  );

  const deletedCheck = await prisma.$queryRawUnsafe(
    'SELECT * FROM religious_article WHERE id = ?',
    articleId
  );
  assert.equal(deletedCheck.length, 0, 'Article should be successfully deleted');
});
