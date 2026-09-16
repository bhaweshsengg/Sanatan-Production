import test from 'node:test';
import assert from 'node:assert/strict';
import { blogCreateSchema, blogStatusSchema, blogUpdateSchema } from '../src/validators/blog.validator.js';
import { prisma, ensureRequiredTables } from '../src/config/db.js';

test('blogCreateSchema validates required blog fields correctly', () => {
  const validBlog = {
    title: 'The Eternal Wisdom of the Bhagavad Gita',
    category: 'Scriptures',
    excerpt: 'An insightful overview of karma yoga and bhakti yoga in modern life.',
    content: 'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. It teaches how to act without attachment to the fruits of work.',
    authorName: 'Acharya Sharma',
    status: 'Published',
    tags: 'Gita, Karma, Dharma',
    readTime: '4 min read',
  };

  const result = blogCreateSchema.safeParse(validBlog);
  assert.equal(result.success, true, 'Valid blog must pass validation');
  assert.equal(result.data.title, 'The Eternal Wisdom of the Bhagavad Gita');
  assert.equal(result.data.category, 'Scriptures');
  assert.equal(result.data.status, 'Published');

  const invalidBlog = {
    title: 'A', // Too short
    category: '',
    excerpt: 'Short',
    content: 'Too short',
    authorName: '',
  };

  const invalidResult = blogCreateSchema.safeParse(invalidBlog);
  assert.equal(invalidResult.success, false, 'Invalid blog must fail validation');
});

test('blogStatusSchema validates status transitions', () => {
  assert.equal(blogStatusSchema.safeParse({ status: 'Draft' }).success, true);
  assert.equal(blogStatusSchema.safeParse({ status: 'Published' }).success, true);
  assert.equal(blogStatusSchema.safeParse({ status: 'Archived' }).success, true);
  assert.equal(blogStatusSchema.safeParse({ status: 'InvalidStatus' }).success, false);
});

test('blogUpdateSchema allows partial updates', () => {
  const updatePayload = {
    title: 'Updated Title For Sanatan Wisdom Post',
    status: 'Published',
  };

  const result = blogUpdateSchema.safeParse(updatePayload);
  assert.equal(result.success, true, 'Partial update payload must pass');
  assert.equal(result.data.title, 'Updated Title For Sanatan Wisdom Post');
});

test('Blog database lifecycle: Draft hidden from public, Published visible, Update & Delete', async () => {
  await ensureRequiredTables();

  // 1. Create a draft blog
  const testTitle = `Test Lifecycle Blog ${Date.now()}`;
  const draftBlog = await prisma.blogPost.create({
    data: {
      title: testTitle,
      category: 'Philosophy',
      excerpt: 'This is a test summary for verifying public vs draft isolation.',
      content: 'This is comprehensive test content for the blog post lifecycle validation in automated testing.',
      authorName: 'Test Author',
      status: 'Draft',
      tags: 'test, lifecycle',
    },
  });

  assert.ok(draftBlog.id, 'Draft blog must be created with an ID');

  // 2. Query public published blogs - Draft must NOT appear
  const publicPublished = await prisma.blogPost.findMany({
    where: {
      id: draftBlog.id,
      status: 'Published',
    },
  });
  assert.equal(publicPublished.length, 0, 'Draft blog post must not appear in public query');

  // 3. Publish the blog post
  const publishedBlog = await prisma.blogPost.update({
    where: { id: draftBlog.id },
    data: {
      status: 'Published',
      publishedAt: new Date(),
    },
  });
  assert.equal(publishedBlog.status, 'Published');

  // 4. Query public published blogs - Now it must appear
  const foundPublished = await prisma.blogPost.findFirst({
    where: {
      id: draftBlog.id,
      status: 'Published',
    },
  });
  assert.ok(foundPublished, 'Published blog post must be queryable in public endpoint');
  assert.equal(foundPublished.title, testTitle);

  // 5. Cleanup
  await prisma.blogPost.delete({ where: { id: draftBlog.id } });
  const afterDelete = await prisma.blogPost.findUnique({ where: { id: draftBlog.id } });
  assert.equal(afterDelete, null, 'Deleted blog post must no longer exist');
});
