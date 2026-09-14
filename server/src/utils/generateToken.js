const jwt = require('jsonwebtoken');

// Create a signed JWT containing only the user id.
// The full user (role, status) is fetched from the DB on each request.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;