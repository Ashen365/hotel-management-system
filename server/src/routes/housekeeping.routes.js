const express = require('express');

const housekeepingController = require('../controllers/housekeeping.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { HOUSEKEEPING_ROLES, MANAGER_ROLES } = require('../constants/roles');
const {
  idParamValidation,
  listTasksValidation,
  createTaskValidation,
  updateTaskValidation,
} = require('../validators/housekeeping.validators');

const router = express.Router();

const staffOnly = [protect, authorize(...HOUSEKEEPING_ROLES)];
const managerOnly = [protect, authorize(...MANAGER_ROLES)];

router.get('/', ...staffOnly, listTasksValidation, validate, housekeepingController.getTasks);
router.post('/', ...staffOnly, createTaskValidation, validate, housekeepingController.createTask);
router.patch('/:id', ...staffOnly, idParamValidation, updateTaskValidation, validate, housekeepingController.updateTask);
router.delete('/:id', ...managerOnly, idParamValidation, validate, housekeepingController.deleteTask);

module.exports = router;