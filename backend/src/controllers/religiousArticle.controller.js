import { logger } from '../utils/logger.js';
import { prisma, ensureRequiredTables } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

const formatArticle = (row) => {
  if (!row) return null;
  let parsedVerses = null;
  if (row.verses) {
    if (typeof row.verses === 'string') {
      try {
        parsedVerses = JSON.parse(row.verses);
      } catch {
        parsedVerses = [];
      }
    } else {
      parsedVerses = row.verses;
    }
  }

  return {
    id: row.id,
    title: row.title,
    sanskritTitle: row.sanskrit_title || '',
    category: row.category,
    deity: row.deity || '',
    source: row.source || '',
    summary: row.summary || '',
    sanskritText: row.sanskrit_text || '',
    transliteration: row.transliteration || '',
    englishMeaning: row.english_meaning || '',
    significance: row.significance || '',
    bestTimeToChant: row.best_time_to_chant || '',
    verses: parsedVerses || [],
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const listPublicReligiousArticles = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { category, search, limit, page } = req.query;

    let whereClause = "status = 'Published'";
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      whereClause += ' AND category = ?';
      params.push(String(category).trim());
    }

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      whereClause += ` AND (
        title LIKE ? OR
        sanskrit_title LIKE ? OR
        deity LIKE ? OR
        summary LIKE ? OR
        sanskrit_text LIKE ? OR
        transliteration LIKE ? OR
        english_meaning LIKE ?
      )`;
      params.push(term, term, term, term, term, term, term);
    }

    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 20)) : 100;
    const offset = isPaginated ? (pageNum - 1) * limitNum : 0;

    const countRows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as total FROM religious_article WHERE ${whereClause}`,
      ...params
    );
    const total = Number(countRows[0]?.total || 0);

    const rows = await prisma.$queryRawUnsafe(
      `SELECT * FROM religious_article WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      ...params,
      limitNum,
      offset
    );

    return res.json({
      success: true,
      status: 200,
      data: rows.map(formatArticle),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    logger.error('listPublicReligiousArticles error:', error);
    return sendError(res, 500, 'Failed to retrieve religious articles', { details: error.message });
  }
};

export const getPublicReligiousArticleById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;

    const rows = await prisma.$queryRawUnsafe(
      "SELECT * FROM religious_article WHERE id = ? AND status = 'Published'",
      Number(id)
    );

    if (!rows || rows.length === 0) {
      return sendError(res, 404, 'Religious article not found');
    }

    return sendSuccess(res, 200, {
      article: formatArticle(rows[0]),
      data: formatArticle(rows[0]),
    });
  } catch (error) {
    logger.error('getPublicReligiousArticleById error:', error);
    return sendError(res, 500, 'Failed to fetch religious article', { details: error.message });
  }
};

export const listAdminReligiousArticles = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { category, status, search, limit, page } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (category && category !== 'All' && category !== 'all') {
      whereClause += ' AND category = ?';
      params.push(String(category).trim());
    }

    if (status && status !== 'All' && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(String(status).trim());
    }

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      whereClause += ` AND (
        title LIKE ? OR
        sanskrit_title LIKE ? OR
        deity LIKE ? OR
        summary LIKE ? OR
        sanskrit_text LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    const isPaginated = page !== undefined || (limit !== undefined && limit !== 'all');
    const pageNum = isPaginated ? Math.max(1, Number(page || 1)) : 1;
    const limitNum = isPaginated ? Math.max(1, Number(limit || 20)) : 100;
    const offset = isPaginated ? (pageNum - 1) * limitNum : 0;

    const countRows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as total FROM religious_article WHERE ${whereClause}`,
      ...params
    );
    const total = Number(countRows[0]?.total || 0);

    const rows = await prisma.$queryRawUnsafe(
      `SELECT * FROM religious_article WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      ...params,
      limitNum,
      offset
    );

    return res.json({
      success: true,
      status: 200,
      data: rows.map(formatArticle),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    logger.error('listAdminReligiousArticles error:', error);
    return sendError(res, 500, 'Failed to retrieve religious articles', { details: error.message });
  }
};

export const getAdminReligiousArticleById = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;

    const rows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );

    if (!rows || rows.length === 0) {
      return sendError(res, 404, 'Religious article not found');
    }

    return sendSuccess(res, 200, {
      article: formatArticle(rows[0]),
      data: formatArticle(rows[0]),
    });
  } catch (error) {
    logger.error('getAdminReligiousArticleById error:', error);
    return sendError(res, 500, 'Failed to fetch religious article', { details: error.message });
  }
};

export const createReligiousArticle = async (req, res) => {
  try {
    await ensureRequiredTables();
    const {
      title,
      sanskritTitle,
      category,
      deity,
      source,
      summary,
      sanskritText,
      transliteration,
      englishMeaning,
      significance,
      bestTimeToChant,
      verses,
      status = 'Published',
    } = req.body;

    const versesJson = verses
      ? (typeof verses === 'string' ? verses : JSON.stringify(verses))
      : null;

    await prisma.$executeRawUnsafe(
      `INSERT INTO religious_article (
        title, sanskrit_title, category, deity, source,
        summary, sanskrit_text, transliteration, english_meaning,
        significance, best_time_to_chant, verses, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      title,
      sanskritTitle || null,
      category,
      deity || null,
      source || null,
      summary,
      sanskritText || null,
      transliteration || null,
      englishMeaning || null,
      significance || null,
      bestTimeToChant || null,
      versesJson,
      status
    );

    const insertedRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article ORDER BY id DESC LIMIT 1'
    );
    const created = formatArticle(insertedRows[0]);

    return sendSuccess(res, 201, {
      message: 'Religious article created successfully',
      article: created,
      data: created,
    });
  } catch (error) {
    logger.error('createReligiousArticle error:', error);
    return sendError(res, 500, 'Failed to create religious article', { details: error.message });
  }
};

export const updateReligiousArticle = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;

    const existingRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );

    if (!existingRows || existingRows.length === 0) {
      return sendError(res, 404, 'Religious article not found');
    }

    const {
      title,
      sanskritTitle,
      category,
      deity,
      source,
      summary,
      sanskritText,
      transliteration,
      englishMeaning,
      significance,
      bestTimeToChant,
      verses,
      status,
    } = req.body;

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (sanskritTitle !== undefined) { updates.push('sanskrit_title = ?'); params.push(sanskritTitle || null); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (deity !== undefined) { updates.push('deity = ?'); params.push(deity || null); }
    if (source !== undefined) { updates.push('source = ?'); params.push(source || null); }
    if (summary !== undefined) { updates.push('summary = ?'); params.push(summary); }
    if (sanskritText !== undefined) { updates.push('sanskrit_text = ?'); params.push(sanskritText || null); }
    if (transliteration !== undefined) { updates.push('transliteration = ?'); params.push(transliteration || null); }
    if (englishMeaning !== undefined) { updates.push('english_meaning = ?'); params.push(englishMeaning || null); }
    if (significance !== undefined) { updates.push('significance = ?'); params.push(significance || null); }
    if (bestTimeToChant !== undefined) { updates.push('best_time_to_chant = ?'); params.push(bestTimeToChant || null); }
    if (verses !== undefined) {
      const versesJson = verses
        ? (typeof verses === 'string' ? verses : JSON.stringify(verses))
        : null;
      updates.push('verses = ?');
      params.push(versesJson);
    }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return sendSuccess(res, 200, {
        message: 'No changes provided',
        article: formatArticle(existingRows[0]),
      });
    }

    updates.push('updated_at = NOW()');
    params.push(Number(id));

    await prisma.$executeRawUnsafe(
      `UPDATE religious_article SET ${updates.join(', ')} WHERE id = ?`,
      ...params
    );

    const updatedRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );
    const updated = formatArticle(updatedRows[0]);

    return sendSuccess(res, 200, {
      message: 'Religious article updated successfully',
      article: updated,
      data: updated,
    });
  } catch (error) {
    logger.error('updateReligiousArticle error:', error);
    return sendError(res, 500, 'Failed to update religious article', { details: error.message });
  }
};

export const updateReligiousArticleStatus = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;
    const { status } = req.body;

    const existingRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );

    if (!existingRows || existingRows.length === 0) {
      return sendError(res, 404, 'Religious article not found');
    }

    await prisma.$executeRawUnsafe(
      'UPDATE religious_article SET status = ?, updated_at = NOW() WHERE id = ?',
      status,
      Number(id)
    );

    const updatedRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );

    return sendSuccess(res, 200, {
      message: 'Article status updated successfully',
      article: formatArticle(updatedRows[0]),
    });
  } catch (error) {
    logger.error('updateReligiousArticleStatus error:', error);
    return sendError(res, 500, 'Failed to update status', { details: error.message });
  }
};

export const deleteReligiousArticle = async (req, res) => {
  try {
    await ensureRequiredTables();
    const { id } = req.params;

    const existingRows = await prisma.$queryRawUnsafe(
      'SELECT * FROM religious_article WHERE id = ?',
      Number(id)
    );

    if (!existingRows || existingRows.length === 0) {
      return sendError(res, 404, 'Religious article not found');
    }

    await prisma.$executeRawUnsafe(
      'DELETE FROM religious_article WHERE id = ?',
      Number(id)
    );

    return sendSuccess(res, 200, { message: 'Religious article deleted successfully' });
  } catch (error) {
    logger.error('deleteReligiousArticle error:', error);
    return sendError(res, 500, 'Failed to delete religious article', { details: error.message });
  }
};
