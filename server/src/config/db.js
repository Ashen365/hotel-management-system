const mongoose = require('mongoose');

// Connect to MongoDB using the URI from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Give up if the database is unreachable (fail fast in production)
    process.exit(1);
  }
};

module.exports = connectDB;