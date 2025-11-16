const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT id, name, email, department, profile_image_url, role, created_at FROM users';
    const params = [];

    if (query) {
      queryText += ` WHERE name ILIKE $1 OR email ILIKE $1 OR department ILIKE $1`;
      params.push(`%${query}%`);
      queryText += ` LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      queryText += ` LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(queryText, params);

    res.json({
      users: result.rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, department, profile_image_url, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, department, avatar_url, role = 'external' } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, department, profile_image_url, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, department || '', avatar_url || '', role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, avatar_url, role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           department = COALESCE($3, department),
           profile_image_url = COALESCE($4, profile_image_url),
           role = COALESCE($5, role),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, email, department, avatar_url, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
