// Centralized error handler.
// Every error thrown in the app ends up here, so the response format stays consistent.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose duplicate key error (unique field already exists)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value entered';
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;