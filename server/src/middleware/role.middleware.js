const ApiError = require('../utils/ApiError');

// Restrict a route to specific roles.
// Usage: router.get('/', protect, authorize('admin', 'manager'), handler)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role "${req.user.role}" is not allowed to access this route`));
    }

    next();
  };
};

module.exports = { authorize };