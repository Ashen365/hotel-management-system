const express = require('express');

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hotel Management API is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;