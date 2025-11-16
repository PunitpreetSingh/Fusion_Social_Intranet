const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/status', async (req, res) => {
  try {
    const { authorId, body, postIn } = req.body;

    if (!authorId || !body) {
      return res.status(400).json({ error: 'authorId and body are required' });
    }

    const result = await pool.query(
      'INSERT INTO status_updates (user_id, content, post_in) VALUES ($1, $2, $3) RETURNING *',
      [authorId, body, postIn || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating status update:', error);
    res.status(500).json({ error: 'Failed to create status update' });
  }
});

router.post('/document', async (req, res) => {
  try {
    const { authorId, title, body, visibility, tags = [], authors = [] } = req.body;

    if (!authorId || !title || !body) {
      return res.status(400).json({ error: 'authorId, title, and body are required' });
    }

    const result = await pool.query(
      `INSERT INTO documents (user_id, title, content, visibility_type, place_name, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        authorId,
        title,
        body,
        visibility?.type || 'community',
        visibility?.placeName || '',
        tags,
        'published'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

router.post('/blog', async (req, res) => {
  try {
    const { authorId, title, body, visibility, tags = [], blogFor } = req.body;

    if (!authorId || !title || !body) {
      return res.status(400).json({ error: 'authorId, title, and body are required' });
    }

    const result = await pool.query(
      `INSERT INTO blog_posts (user_id, title, content, visibility_type, place_name, blog_name, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        authorId,
        title,
        body,
        visibility?.type || 'personal_blog',
        visibility?.placeName || '',
        blogFor || 'Personal Blog',
        tags,
        'published'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText;
    let params = [limit, offset];

    switch (type) {
      case 'status':
        queryText = `
          SELECT s.*, u.name as author_name, u.profile_image_url as author_avatar
          FROM status_updates s
          JOIN users u ON s.user_id = u.id
          ORDER BY s.created_at DESC
          LIMIT $1 OFFSET $2
        `;
        break;
      case 'document':
        queryText = `
          SELECT d.*, u.name as author_name, u.profile_image_url as author_avatar
          FROM documents d
          JOIN users u ON d.user_id = u.id
          WHERE d.status = 'published'
          ORDER BY d.created_at DESC
          LIMIT $1 OFFSET $2
        `;
        break;
      case 'blog':
        queryText = `
          SELECT b.*, u.name as author_name, u.profile_image_url as author_avatar
          FROM blog_posts b
          JOIN users u ON b.user_id = u.id
          WHERE b.status = 'published'
          ORDER BY b.created_at DESC
          LIMIT $1 OFFSET $2
        `;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type. Use status, document, or blog' });
    }

    const result = await pool.query(queryText, params);

    res.json({
      content: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

module.exports = router;
