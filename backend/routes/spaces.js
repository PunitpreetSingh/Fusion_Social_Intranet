const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM spaces';
    const params = [];

    if (query) {
      queryText += ` WHERE name ILIKE $1`;
      params.push(`%${query}%`);
      queryText += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      queryText += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(queryText, params);

    res.json({
      spaces: result.rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ error: 'Failed to fetch spaces' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, createdBy, parent_place = '' } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Name and createdBy are required' });
    }

    const result = await pool.query(
      'INSERT INTO spaces (name, user_id, parent_place) VALUES ($1, $2, $3) RETURNING *',
      [name, createdBy, parent_place]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: 'Failed to create space' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_place } = req.body;

    const result = await pool.query(
      `UPDATE spaces
       SET name = COALESCE($1, name),
           parent_place = COALESCE($2, parent_place),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [name, parent_place, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating space:', error);
    res.status(500).json({ error: 'Failed to update space' });
  }
});

module.exports = router;
