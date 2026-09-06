export const MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR = 2;

export const isTempleAdminRelation = (relationshipName = '') => {
  if (!relationshipName || typeof relationshipName !== 'string') {
    return false;
  }

  return relationshipName.trim().toLowerCase() === 'temple admin';
};

export const validateApprovalLimit = (approvedAdminsCount) => {
  const count = Number(approvedAdminsCount || 0);

  if (count >= MAX_APPROVED_TEMPLE_ADMINS_PER_MANDIR) {
    throw new Error('Maximum 2 Temple Admins are already assigned to this Mandir.');
  }

  return true;
};
