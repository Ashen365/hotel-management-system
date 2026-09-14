const express = require('express');

const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { STAFF_ROLES } = require('../constants/roles');
const { listUsersValidation } = require('../validators/user.validators');

const router = express.Router();

router.get(
  '/',
  protect,
  authorize(...STAFF_ROLES),
  listUsersValidation,
  validate,
  userController.getUsers
);

module.exports = router;