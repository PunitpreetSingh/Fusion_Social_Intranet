const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const usersRouter = require('./routes/users');
const spacesRouter = require('./routes/spaces');
const contentRouter = require('./routes/content');
const adminRouter = require('./routes/admin');
const uploadsRouter = require('./routes/uploads');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? `- Body: ${JSON.stringify(req.body).substring(0, 100)}` : '');
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Social Intranet API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      spaces: '/api/spaces',
      content: '/api/content',
      admin: '/api/admin',
      uploads: '/api/uploads'
    }
  });
});

// API status endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/users', usersRouter);
app.use('/api/spaces', spacesRouter);
app.use('/api/content', contentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

// 404 handler (must be after all routes)
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
