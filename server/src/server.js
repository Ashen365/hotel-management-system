const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start receiving requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Hotel Management API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});