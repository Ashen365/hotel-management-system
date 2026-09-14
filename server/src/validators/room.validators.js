const { body, query, param } = require('express-validator');
const { ROOM_TYPES, ROOM_STATUSES } = require('../models/Room');

const TYPE_MSG = `Type must be one of: ${ROOM_TYPES.join(', ')}`;
const STATUS_MSG = `Status must be one of: ${ROOM_STATUSES.join(', ')}`;

const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid room id'),
];

const listRoomsValidation = [
  query('type').optional().isIn(ROOM_TYPES).withMessage(TYPE_MSG),
  query('status').optional().isIn(ROOM_STATUSES).withMessage(STATUS_MSG),
  query('available').optional().isIn(['true', 'false']).withMessage('available must be true or false'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a non-negative number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a non-negative number'),
  query('capacity').optional().isInt({ min: 1 }).withMessage('capacity must be a positive integer'),
];

const createRoomValidation = [
  body('number').trim().notEmpty().withMessage('Room number is required'),
  body('type').isIn(ROOM_TYPES).withMessage(TYPE_MSG),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('pricePerNight must be a non-negative number'),
  body('capacity').isInt({ min: 1 }).withMessage('capacity must be at least 1'),
  body('status').optional().isIn(ROOM_STATUSES).withMessage(STATUS_MSG),
  body('amenities').optional().isArray().withMessage('amenities must be an array'),
  body('amenities.*').optional().isString().withMessage('each amenity must be a string'),
  body('description').optional().isString().withMessage('description must be a string'),
];

const updateRoomValidation = [
  body('number').optional().trim().notEmpty().withMessage('Room number cannot be empty'),
  body('type').optional().isIn(ROOM_TYPES).withMessage(TYPE_MSG),
  body('pricePerNight').optional().isFloat({ min: 0 }).withMessage('pricePerNight must be a non-negative number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('capacity must be at least 1'),
  body('status').optional().isIn(ROOM_STATUSES).withMessage(STATUS_MSG),
  body('amenities').optional().isArray().withMessage('amenities must be an array'),
  body('amenities.*').optional().isString().withMessage('each amenity must be a string'),
  body('description').optional().isString().withMessage('description must be a string'),
];

module.exports = { idParamValidation, listRoomsValidation, createRoomValidation, updateRoomValidation };