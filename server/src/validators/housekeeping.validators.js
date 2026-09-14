const { body, query, param } = require('express-validator');
const { HOUSEKEEPING_STATUSES } = require('../models/HousekeepingTask');

const STATUS_MSG = `Status must be one of: ${HOUSEKEEPING_STATUSES.join(', ')}`;

const idParamValidation = [param('id').isMongoId().withMessage('Invalid task id')];

const listTasksValidation = [
  query('status').optional().isIn(HOUSEKEEPING_STATUSES).withMessage(STATUS_MSG),
];

const createTaskValidation = [
  body('roomId').isMongoId().withMessage('A valid room id is required'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid staff id'),
  body('notes').optional().isString().withMessage('notes must be a string'),
  body('dueDate').optional().notEmpty().withMessage('dueDate must be a valid date'),
];

const updateTaskValidation = [
  body('status').optional().isIn(HOUSEKEEPING_STATUSES).withMessage(STATUS_MSG),
  body('assignedTo').optional().isMongoId().withMessage('Invalid staff id'),
  body('notes').optional().isString().withMessage('notes must be a string'),
  body('dueDate').optional().notEmpty().withMessage('dueDate must be a valid date'),
];

module.exports = { idParamValidation, listTasksValidation, createTaskValidation, updateTaskValidation };