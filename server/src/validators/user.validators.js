const { query } = require('express-validator');
const { USER_ROLES } = require('../models/User');

const listUsersValidation = [
  query('role')
    .optional()
    .isIn(USER_ROLES)
    .withMessage(`Role must be one of: ${USER_ROLES.join(', ')}`),
];

module.exports = { listUsersValidation };