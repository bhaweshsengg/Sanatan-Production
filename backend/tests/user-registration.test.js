import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isTempleAdminRelation,
  validateApprovalLimit,
  MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR,
} from '../src/utils/mandirApproval.js';

test('Temple Admin relation detection is case-insensitive and stable', () => {
  assert.equal(isTempleAdminRelation('Temple Admin'), true);
  assert.equal(isTempleAdminRelation('temple admin'), true);
  assert.equal(isTempleAdminRelation('Temple Devotee'), false);
});

test('Approval limit validation blocks a third approved admin', () => {
  assert.throws(() => validateApprovalLimit(2), {
    message: 'Maximum 2 Temple Admins are already assigned to this Mandir.',
  });

  assert.doesNotThrow(() => validateApprovalLimit(1));
  assert.equal(MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR, 2);
});
