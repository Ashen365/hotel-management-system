const app = require('./app');

const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
  console.log(`Hotel Management API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});