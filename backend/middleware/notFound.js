const notFound = (req, res, next) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.path}`);

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: {
      users: '/api/users',
      spaces: '/api/spaces',
      content: '/api/content',
      admin: '/api/admin',
      uploads: '/api/uploads'
    }
  });
};

module.exports = notFound;
