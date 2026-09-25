import crypto from 'node:crypto';

let counter = 0;

/**
 * Generates a cuid (collision-resistant unique identifier) conforming to cuid v1 format:
 * - Starts with 'c'
 * - Timestamp in base36
 * - Counter in base36 (padded)
 * - Process/fingerprint hex
 * - Random base36 string
 * Total length is 25 characters.
 */
export function generateCuid() {
  const timestamp = Date.now().toString(36);
  counter = (counter + 1) % 1679616; // 36^4
  const countStr = counter.toString(36).padStart(4, '0');
  const fingerprint = crypto.randomBytes(2).toString('hex');
  const random = crypto.randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, 'a').slice(0, 8);
  return `c${timestamp}${countStr}${fingerprint}${random}`.slice(0, 25);
}
