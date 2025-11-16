const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/form-fields', async (req, res) => {
  try {
    const { formName } = req.query;

    if (!formName) {
      return res.status(400).json({ error: 'formName query parameter is required' });
    }

    const result = await pool.query(
      'SELECT * FROM form_fields WHERE form_name = $1',
      [formName]
    );

    if (result.rows.length === 0) {
      return res.json({ formName, fieldSchema: {} });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching form fields:', error);
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
});

router.post('/form-fields', async (req, res) => {
  try {
    const { formName, fieldSchemaJson } = req.body;

    if (!formName || !fieldSchemaJson) {
      return res.status(400).json({ error: 'formName and fieldSchemaJson are required' });
    }

    const result = await pool.query(
      `INSERT INTO form_fields (form_name, field_schema)
       VALUES ($1, $2)
       ON CONFLICT (form_name)
       DO UPDATE SET field_schema = $2, updated_at = NOW()
       RETURNING *`,
      [formName, JSON.stringify(fieldSchemaJson)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating/updating form fields:', error);
    res.status(500).json({ error: 'Failed to create/update form fields' });
  }
});

router.delete('/form-fields/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM form_fields WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Form field configuration not found' });
    }

    res.json({ message: 'Form field configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting form fields:', error);
    res.status(500).json({ error: 'Failed to delete form fields' });
  }
});

module.exports = router;
