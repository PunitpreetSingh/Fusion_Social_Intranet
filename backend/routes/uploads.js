const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { upload, uploadDir } = require('../middleware/upload');

// Upload single file
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { contentType, contentId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Save to attachments table
    const result = await pool.query(
      `INSERT INTO attachments (content_type, content_id, file_url, file_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [contentType || 'document', contentId || null, fileUrl, req.file.originalname]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    next(error);
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const { contentType, contentId } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const fileUrl = `/uploads/${file.filename}`;
      const result = await pool.query(
        `INSERT INTO attachments (content_type, content_id, file_url, file_name)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [contentType || 'document', contentId || null, fileUrl, file.originalname]
      );
      uploadedFiles.push({ ...result.rows[0], url: fileUrl });
    }

    res.status(201).json({
      success: true,
      data: uploadedFiles,
      count: uploadedFiles.length
    });
  } catch (error) {
    next(error);
  }
});

// Serve uploaded files
router.use('/files', express.static(uploadDir));

module.exports = router;
