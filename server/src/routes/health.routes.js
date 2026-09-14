const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected

  res.status(200).json({
    success: true,
    message: 'Hotel Management API is running',
    data: {
      database: dbState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;