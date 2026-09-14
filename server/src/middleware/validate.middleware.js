const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs the express-validator checks defined on the route.
// If any check failed, respond with 400 and all messages.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ApiError(400, messages.join(' | ')));
  }

  next();
};

module.exports = validate;