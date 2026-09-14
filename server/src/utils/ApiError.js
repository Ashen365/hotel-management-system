// Standard API error with an HTTP status code.
// Throw this from controllers: next(new ApiError(400, 'Bad request'))
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;