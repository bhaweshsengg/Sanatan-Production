import { logger } from '../utils/logger.js';
import { prisma, ensureRequiredTables } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { createGroupSchema, updateGroupSchema, joinGroupSchema } from '../validators/communityGroup.validator.js';

// Ensure tables are provisioned
ensureRequiredTables().catch((err) => logger.error('Community tables init error:', err));

export const getDiscussions = async (req, res) => {
  try {
    const { category, cityId, tag, page = 1, limit = 20 } = req.query;
    
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const offset = (pageNum - 1) * limitNum;
    
    let whereClause = '1=1';
    let params = [];
    
    if (category) {
      whereClause += ' AND d.category = ?';
      params.push(category);
    }
    if (cityId) {
      whereClause += ' AND d.cityId = ?';
      params.push(Number(cityId));
    }
    if (tag) {
      whereClause += ' AND d.tags LIKE ?';
      params.push(`%${tag}%`);
    }

    const query = `
      SELECT d.*, u.username as authorName, c.name as cityName
      FROM Discussion d
      LEFT JOIN user u ON d.authorId = u.id
      LEFT JOIN temple_city c ON d.cityId = c.id
      WHERE ${whereClause}
      ORDER BY d.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Discussion d
      WHERE ${whereClause}
    `;

    const discussions = await prisma.$queryRawUnsafe(query, ...params, limitNum, offset);
    const totalResult = await prisma.$queryRawUnsafe(countQuery, ...params);
    const total = Number(totalResult[0]?.total || 0);

    const formattedDiscussions = discussions.map(d => ({
      id: d.id,
      title: d.title,
      content: d.content,
      category: d.category,
      tags: d.tags ? (typeof d.tags === 'string' ? JSON.parse(d.tags) : d.tags) : [],
      authorName: d.authorName,
      cityName: d.cityName,
      createdAt: d.createdAt
    }));

    return sendSuccess(res, 200, {
      data: formattedDiscussions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch discussions', { details: error.message });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { title, content, category, tags, cityId } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (!title || !content || !category) {
      return sendError(res, 400, 'Title, content, and category are required');
    }

    const tagsJson = tags ? (Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([tags])) : null;
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO Discussion (title, content, category, tags, cityId, authorId, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, title, content, category, tagsJson, cityId ? Number(cityId) : null, authorId);

    return sendSuccess(res, 201, { message: 'Discussion created successfully' });
  } catch (error) {
    return sendError(res, 500, 'Failed to create discussion', { details: error.message });
  }
};

// ==========================================
// LOCAL GROUPS CONTROLLERS
// ==========================================

export const getGroups = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { search, category, cityId, userEmail, page = 1, limit = 50 } = req.query;
    const currentUserEmail = (req.user?.email || userEmail || '').trim().toLowerCase();

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ["g.status != 'Archived'"];
    let params = [];

    if (search) {
      whereConditions.push('(g.name LIKE ? OR g.description LIKE ? OR g.city_name LIKE ?)');
      const searchParam = `%${search.trim()}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (category && category !== 'All') {
      whereConditions.push('g.category = ?');
      params.push(category);
    }

    if (cityId) {
      whereConditions.push('g.city_id = ?');
      params.push(Number(cityId));
    }

    const whereClause = whereConditions.join(' AND ');

    const groupsQuery = `
      SELECT 
        g.id, g.name, g.slug, g.category, g.description, 
        g.city_id, g.city_name, g.meeting_info, g.contact_email, g.contact_phone,
        g.image_url, g.creator_id, g.creator_name, g.status, g.created_at, g.updated_at,
        COUNT(m.id) AS memberCount
      FROM community_group g
      LEFT JOIN community_group_member m ON g.id = m.group_id
      WHERE ${whereClause}
      GROUP BY g.id
      ORDER BY g.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT g.id) AS total
      FROM community_group g
      WHERE ${whereClause}
    `;

    const groups = await prisma.$queryRawUnsafe(groupsQuery, ...params, limitNum, offset);
    const countResult = await prisma.$queryRawUnsafe(countQuery, ...params);
    const total = Number(countResult[0]?.total || 0);

    // If currentUserEmail is present, fetch the list of group IDs user is a member of
    let userJoinedGroupIds = new Set();
    if (currentUserEmail) {
      const userMemberships = await prisma.$queryRawUnsafe(
        'SELECT group_id FROM community_group_member WHERE LOWER(email) = ?',
        currentUserEmail
      );
      userJoinedGroupIds = new Set(userMemberships.map((m) => Number(m.group_id)));
    }

    const formattedGroups = groups.map((g) => ({
      id: Number(g.id),
      name: g.name,
      slug: g.slug,
      category: g.category,
      description: g.description,
      cityId: g.city_id ? Number(g.city_id) : null,
      cityName: g.city_name || '',
      meetingInfo: g.meeting_info || '',
      contactEmail: g.contact_email || '',
      contactPhone: g.contact_phone || '',
      imageUrl: g.image_url || '',
      creatorId: g.creator_id ? Number(g.creator_id) : null,
      creatorName: g.creator_name || 'Community Member',
      status: g.status,
      memberCount: Number(g.memberCount || 0),
      isMember: userJoinedGroupIds.has(Number(g.id)),
      createdAt: g.created_at,
      updatedAt: g.updated_at,
    }));

    return sendSuccess(res, 200, {
      data: formattedGroups,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error in getGroups:', error);
    return sendError(res, 500, 'Failed to fetch local groups', { details: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const currentUserEmail = (req.user?.email || req.query.userEmail || '').trim().toLowerCase();

    const groups = await prisma.$queryRawUnsafe(
      'SELECT * FROM community_group WHERE id = ?',
      Number(id)
    );

    if (!groups || groups.length === 0) {
      return sendError(res, 404, 'Group not found');
    }

    const group = groups[0];

    // Fetch members of this group
    const members = await prisma.$queryRawUnsafe(
      `SELECT id, group_id, user_id, name, email, phone, role, joined_at
       FROM community_group_member 
       WHERE group_id = ? 
       ORDER BY CASE WHEN role = 'Organizer' THEN 0 WHEN role = 'Co-organizer' THEN 1 ELSE 2 END, joined_at ASC`,
      Number(id)
    );

    const isMember = currentUserEmail
      ? members.some((m) => m.email.toLowerCase() === currentUserEmail)
      : false;

    const formattedGroup = {
      id: Number(group.id),
      name: group.name,
      slug: group.slug,
      category: group.category,
      description: group.description,
      cityId: group.city_id ? Number(group.city_id) : null,
      cityName: group.city_name || '',
      meetingInfo: group.meeting_info || '',
      contactEmail: group.contact_email || '',
      contactPhone: group.contact_phone || '',
      imageUrl: group.image_url || '',
      creatorId: group.creator_id ? Number(group.creator_id) : null,
      creatorName: group.creator_name || 'Community Member',
      status: group.status,
      memberCount: members.length,
      isMember,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
      members: members.map((m) => ({
        id: Number(m.id),
        name: m.name,
        role: m.role,
        joinedAt: m.joined_at,
      })),
    };

    return sendSuccess(res, 200, { data: formattedGroup });
  } catch (error) {
    logger.error('Error in getGroupById:', error);
    return sendError(res, 500, 'Failed to fetch group details', { details: error.message });
  }
};

export const createGroup = async (req, res) => {
  try {
    await ensureRequiredTables();
    const validation = createGroupSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, 'Validation failed', {
        fieldErrors: validation.error.flatten().fieldErrors,
      });
    }

    const {
      name,
      category,
      description,
      cityName,
      cityId,
      meetingInfo,
      contactEmail,
      contactPhone,
      imageUrl,
      creatorName,
    } = validation.data;

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug || 'group';
    const existing = await prisma.$queryRawUnsafe('SELECT id FROM community_group WHERE slug = ?', slug);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Resolve city name if cityId is provided and cityName is not
    let resolvedCityName = cityName;
    if (!resolvedCityName && cityId) {
      const cityRec = await prisma.$queryRawUnsafe('SELECT name FROM temple_city WHERE id = ?', Number(cityId));
      if (cityRec.length > 0) {
        resolvedCityName = cityRec[0].name;
      }
    }

    const effectiveCreatorId = req.user?.id || null;
    const effectiveCreatorName = creatorName || req.user?.username || 'Community Organizer';
    const effectiveEmail = contactEmail || req.user?.email || null;

    await prisma.$executeRawUnsafe(
      `INSERT INTO community_group (
        name, slug, category, description, city_id, city_name, 
        meeting_info, contact_email, contact_phone, image_url, 
        creator_id, creator_name, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW(), NOW())`,
      name,
      slug,
      category,
      description,
      cityId ? Number(cityId) : null,
      resolvedCityName || null,
      meetingInfo || null,
      effectiveEmail,
      contactPhone || null,
      imageUrl || null,
      effectiveCreatorId,
      effectiveCreatorName
    );

    const inserted = await prisma.$queryRawUnsafe('SELECT id FROM community_group WHERE slug = ?', slug);
    const newGroupId = Number(inserted[0]?.id);

    // Automatically add creator as Organizer member if contact email or user email is available
    if (newGroupId && effectiveEmail) {
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO community_group_member (group_id, user_id, name, email, phone, role, joined_at)
           VALUES (?, ?, ?, ?, ?, 'Organizer', NOW())`,
          newGroupId,
          effectiveCreatorId,
          effectiveCreatorName,
          effectiveEmail,
          contactPhone || null
        );
      } catch (err) {
        logger.warn('Failed to add creator as first group member:', err.message);
      }
    }

    return sendSuccess(res, 201, {
      message: 'Group created successfully',
      data: {
        id: newGroupId,
        slug,
        name,
      },
    });
  } catch (error) {
    logger.error('Error in createGroup:', error);
    return sendError(res, 500, 'Failed to create group', { details: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const validation = updateGroupSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, 'Validation failed', {
        fieldErrors: validation.error.flatten().fieldErrors,
      });
    }

    const groups = await prisma.$queryRawUnsafe('SELECT * FROM community_group WHERE id = ?', Number(id));
    if (!groups || groups.length === 0) {
      return sendError(res, 404, 'Group not found');
    }

    const existingGroup = groups[0];

    // Authorization: only creator or Admin can edit
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    const isCreator = existingGroup.creator_id === req.user.id;
    const isAdmin = req.user.role === 'Admin';
    const isEmailMatch = Boolean(req.user.email && existingGroup.contact_email?.toLowerCase() === req.user.email.toLowerCase());
    if (!isCreator && !isAdmin && !isEmailMatch) {
      return sendError(res, 403, 'Forbidden: You do not have permission to edit this group');
    }

    const updates = validation.data;
    const fieldsToUpdate = [];
    const params = [];

    if (updates.name !== undefined) { fieldsToUpdate.push('name = ?'); params.push(updates.name); }
    if (updates.category !== undefined) { fieldsToUpdate.push('category = ?'); params.push(updates.category); }
    if (updates.description !== undefined) { fieldsToUpdate.push('description = ?'); params.push(updates.description); }
    if (updates.cityName !== undefined) { fieldsToUpdate.push('city_name = ?'); params.push(updates.cityName); }
    if (updates.cityId !== undefined) { fieldsToUpdate.push('city_id = ?'); params.push(updates.cityId ? Number(updates.cityId) : null); }
    if (updates.meetingInfo !== undefined) { fieldsToUpdate.push('meeting_info = ?'); params.push(updates.meetingInfo); }
    if (updates.contactEmail !== undefined) { fieldsToUpdate.push('contact_email = ?'); params.push(updates.contactEmail); }
    if (updates.contactPhone !== undefined) { fieldsToUpdate.push('contact_phone = ?'); params.push(updates.contactPhone); }
    if (updates.imageUrl !== undefined) { fieldsToUpdate.push('image_url = ?'); params.push(updates.imageUrl); }
    if (updates.status !== undefined) { fieldsToUpdate.push('status = ?'); params.push(updates.status); }

    if (fieldsToUpdate.length === 0) {
      return sendSuccess(res, 200, { message: 'No changes provided' });
    }

    fieldsToUpdate.push('updated_at = NOW()');
    params.push(Number(id));

    await prisma.$executeRawUnsafe(
      `UPDATE community_group SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
      ...params
    );

    return sendSuccess(res, 200, { message: 'Group updated successfully' });
  } catch (error) {
    logger.error('Error in updateGroup:', error);
    return sendError(res, 500, 'Failed to update group', { details: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;

    const groups = await prisma.$queryRawUnsafe('SELECT * FROM community_group WHERE id = ?', Number(id));
    if (!groups || groups.length === 0) {
      return sendError(res, 404, 'Group not found');
    }

    const existingGroup = groups[0];

    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    const isCreator = existingGroup.creator_id === req.user.id;
    const isAdmin = req.user.role === 'Admin';
    const isEmailMatch = Boolean(req.user.email && existingGroup.contact_email?.toLowerCase() === req.user.email.toLowerCase());
    if (!isCreator && !isAdmin && !isEmailMatch) {
      return sendError(res, 403, 'Forbidden: You do not have permission to delete this group');
    }

    // Mark as archived or remove members and group
    await prisma.$executeRawUnsafe('DELETE FROM community_group_member WHERE group_id = ?', Number(id));
    await prisma.$executeRawUnsafe('DELETE FROM community_group WHERE id = ?', Number(id));

    return sendSuccess(res, 200, { message: 'Group removed successfully' });
  } catch (error) {
    logger.error('Error in deleteGroup:', error);
    return sendError(res, 500, 'Failed to delete group', { details: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const groupId = Number(id);

    const groupCheck = await prisma.$queryRawUnsafe(
      "SELECT id, name, status FROM community_group WHERE id = ? AND status != 'Archived'",
      groupId
    );

    if (!groupCheck || groupCheck.length === 0) {
      return sendError(res, 404, 'Active group not found');
    }

    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    // Bind member info to the authenticated user to prevent impersonation
    const bodyData = {
      name: req.body.name || req.user.username || 'Member',
      email: req.user.email || req.body.email || '',
      phone: req.body.phone || '',
      role: req.user.role === 'Admin' ? (req.body.role || 'Member') : 'Member',
    };

    const validation = joinGroupSchema.safeParse(bodyData);
    if (!validation.success) {
      return sendError(res, 400, 'Validation failed', {
        fieldErrors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, email, phone, role } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already a member
    const existingMember = await prisma.$queryRawUnsafe(
      'SELECT id FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?',
      groupId,
      normalizedEmail
    );

    if (existingMember.length > 0) {
      return sendError(res, 409, 'You are already a member of this group.');
    }

    const userId = req.user?.id || null;

    await prisma.$executeRawUnsafe(
      `INSERT INTO community_group_member (group_id, user_id, name, email, phone, role, joined_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      groupId,
      userId,
      name,
      normalizedEmail,
      phone || null,
      role || 'Member'
    );

    // Get new member count
    const memberCountRes = await prisma.$queryRawUnsafe(
      'SELECT COUNT(*) as count FROM community_group_member WHERE group_id = ?',
      groupId
    );

    return sendSuccess(res, 201, {
      message: `Successfully joined ${groupCheck[0].name}!`,
      data: {
        groupId,
        memberCount: Number(memberCountRes[0]?.count || 1),
        isMember: true,
      },
    });
  } catch (error) {
    logger.error('Error in joinGroup:', error);
    return sendError(res, 500, 'Failed to join group', { details: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const groupId = Number(id);

    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    const groups = await prisma.$queryRawUnsafe('SELECT id, creator_id, contact_email FROM community_group WHERE id = ?', groupId);
    const existingGroup = groups && groups.length > 0 ? groups[0] : null;

    const targetEmail = (req.body.email || req.query.email || req.user.email || '').trim().toLowerCase();
    if (!targetEmail) {
      return sendError(res, 400, 'Member email is required to leave group');
    }

    // IDOR protection: Only self, Admin, or Group Creator can remove member
    const isSelf = Boolean(req.user.email && req.user.email.toLowerCase() === targetEmail);
    const isAdmin = req.user.role === 'Admin';
    const isCreator = Boolean(existingGroup && existingGroup.creator_id === req.user.id);

    if (!isSelf && !isAdmin && !isCreator) {
      return sendError(res, 403, 'Forbidden: You do not have permission to remove this member from the group');
    }

    const existingMember = await prisma.$queryRawUnsafe(
      'SELECT id FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?',
      groupId,
      targetEmail
    );

    if (existingMember.length === 0) {
      return sendError(res, 404, 'You are not a member of this group');
    }

    await prisma.$executeRawUnsafe(
      'DELETE FROM community_group_member WHERE group_id = ? AND LOWER(email) = ?',
      groupId,
      targetEmail
    );

    const memberCountRes = await prisma.$queryRawUnsafe(
      'SELECT COUNT(*) as count FROM community_group_member WHERE group_id = ?',
      groupId
    );

    return sendSuccess(res, 200, {
      message: 'Successfully left the group',
      data: {
        groupId,
        memberCount: Number(memberCountRes[0]?.count || 0),
        isMember: false,
      },
    });
  } catch (error) {
    logger.error('Error in leaveGroup:', error);
    return sendError(res, 500, 'Failed to leave group', { details: error.message });
  }
};

// ==========================================
// MEMBERS DIRECTORY CONTROLLER
// ==========================================

export const getMembers = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { search, role, city, page = 1, limit = 24 } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const offset = (pageNum - 1) * limitNum;

    // Fetch approved devotees from TempleDevotee_registration
    const devoteeQuery = `
      SELECT 
        r.id,
        CONCAT(r.first_name, ' ', r.last_name) AS name,
        LOWER(r.email) AS email,
        'Devotee' AS role,
        r.created_at AS joinedAt,
        t.mandir_name AS affiliation,
        c.name AS cityName
      FROM TempleDevotee_registration r
      LEFT JOIN temple_temple t ON r.mandir_id = t.id
      LEFT JOIN temple_city c ON t.city_id = c.id
      WHERE r.status = 'Approved'
    `;
    const devotees = await prisma.$queryRawUnsafe(devoteeQuery);

    // Fetch active users from user table
    const userQuery = `
      SELECT 
        u.id,
        u.username AS name,
        LOWER(u.email) AS email,
        u.role AS role,
        u.createdAt AS joinedAt,
        'Sanatan NZ Platform' AS affiliation,
        NULL AS cityName
      FROM user u
      WHERE u.isActive = 1
    `;
    const users = await prisma.$queryRawUnsafe(userQuery);

    // Fetch group member counts grouped by email
    const groupMemberships = await prisma.$queryRawUnsafe(`
      SELECT LOWER(m.email) AS email, COUNT(DISTINCT m.group_id) AS groupCount, GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS groupNames
      FROM community_group_member m
      JOIN community_group g ON m.group_id = g.id
      GROUP BY LOWER(m.email)
    `);

    const groupMap = new Map();
    for (const gm of groupMemberships) {
      groupMap.set(gm.email, {
        groupCount: Number(gm.groupCount || 0),
        groupNames: gm.groupNames ? gm.groupNames.split(', ') : [],
      });
    }

    // Merge members, deduplicating by email (Devotee record has richer profile)
    const memberMap = new Map();

    for (const d of devotees) {
      if (!d.email) continue;
      const gInfo = groupMap.get(d.email) || { groupCount: 0, groupNames: [] };
      memberMap.set(d.email, {
        id: `devotee-${d.id}`,
        name: d.name,
        role: 'Devotee',
        affiliation: d.affiliation || 'Local Mandir Devotee',
        cityName: d.cityName || 'New Zealand',
        joinedAt: d.joinedAt,
        groupCount: gInfo.groupCount,
        groups: gInfo.groupNames,
      });
    }

    for (const u of users) {
      if (!u.email) continue;
      if (!memberMap.has(u.email)) {
        const gInfo = groupMap.get(u.email) || { groupCount: 0, groupNames: [] };
        memberMap.set(u.email, {
          id: `user-${u.id}`,
          name: u.name,
          role: u.role || 'Member',
          affiliation: u.role === 'Admin' ? 'Platform Administrator' : (u.role === 'TempleManager' ? 'Temple Committee' : 'Community Member'),
          cityName: 'New Zealand',
          joinedAt: u.joinedAt,
          groupCount: gInfo.groupCount,
          groups: gInfo.groupNames,
        });
      } else {
        // If user is Admin or TempleManager, update role badge
        const existing = memberMap.get(u.email);
        if (u.role === 'Admin' || u.role === 'TempleManager') {
          existing.role = u.role;
          existing.affiliation = u.role === 'Admin' ? 'Platform Administrator' : 'Temple Committee';
        }
      }
    }

    let allMembers = Array.from(memberMap.values());

    // Filter by search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allMembers = allMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.affiliation.toLowerCase().includes(q) ||
          m.cityName.toLowerCase().includes(q) ||
          m.groups.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Filter by role
    if (role && role !== 'All') {
      allMembers = allMembers.filter((m) => m.role.toLowerCase() === role.toLowerCase());
    }

    // Filter by city
    if (city && city !== 'All') {
      allMembers = allMembers.filter((m) => m.cityName.toLowerCase().includes(city.toLowerCase()));
    }

    // Sort by joinedAt descending
    allMembers.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

    const total = allMembers.length;
    const paginated = allMembers.slice(offset, offset + limitNum);

    return sendSuccess(res, 200, {
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error in getMembers:', error);
    return sendError(res, 500, 'Failed to fetch member directory', { details: error.message });
  }
};
