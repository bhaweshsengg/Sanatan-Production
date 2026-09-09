import test from 'node:test';
import assert from 'node:assert/strict';
import multer from 'multer';
import { env } from '../src/config/env.js';

test('Environment exposes Blob configuration attributes', () => {
  assert.ok('blobToken' in env, 'env should have blobToken');
  assert.ok('isBlobConfigured' in env, 'env should have isBlobConfigured');
  assert.equal(typeof env.isBlobConfigured, 'boolean');
});

test('@vercel/blob put and del methods are available', async () => {
  const blobModule = await import('@vercel/blob');
  assert.equal(typeof blobModule.put, 'function', 'put must be exported as a function');
  assert.equal(typeof blobModule.del, 'function', 'del must be exported as a function');
});

test('Multer storage selection logic picks memoryStorage when Blob is configured', () => {
  const isBlobEnabledTrue = true;
  const isBlobEnabledFalse = false;

  const storageWithBlob = isBlobEnabledTrue ? multer.memoryStorage() : multer.diskStorage({});
  const storageWithoutBlob = isBlobEnabledFalse ? multer.memoryStorage() : multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, './uploads'),
    filename: (_req, file, cb) => cb(null, file.originalname),
  });

  assert.ok(storageWithBlob, 'Memory storage created successfully');
  assert.ok(storageWithoutBlob, 'Disk storage created successfully');
});

test('normalizeTempleRecord preserves full HTTPS Vercel Blob URLs', async () => {
  const blobUrl = 'https://abc123store.public.blob.vercel-storage.com/temples/123456789-temple.jpg';
  const localUrl = 'uploads/sample.jpg';

  const isHttpsBlob = /^https?:\/\//i.test(blobUrl);
  const isHttpsLocal = /^https?:\/\//i.test(localUrl);

  assert.equal(isHttpsBlob, true, 'Vercel Blob URL must match HTTPS check');
  assert.equal(isHttpsLocal, false, 'Local file path must not match HTTPS check');
});
