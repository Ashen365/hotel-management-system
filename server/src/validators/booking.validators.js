const { body, query, param } = require('express-validator');
const { BOOKING_STATUSES } = require('../models/Booking');

const STATUS_MSG = `Status must be one of: ${BOOKING_STATUSES.join(', ')}`;

const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid booking id'),
];

const listBookingsValidation = [
  query('status').optional().isIn(BOOKING_STATUSES).withMessage(STATUS_MSG),
  query('room').optional().isMongoId().withMessage('Invalid room id'),
];

const createBookingValidation = [
  body('roomId').isMongoId().withMessage('A valid room id is required'),
  body('checkIn').notEmpty().withMessage('Check-in date is required'),
  body('checkOut').notEmpty().withMessage('Check-out date is required'),
  body('guests').isInt({ min: 1 }).withMessage('guests must be at least 1'),
];

const statusValidation = [
  body('status').isIn(BOOKING_STATUSES).withMessage(STATUS_MSG),
];

module.exports = {
  idParamValidation,
  listBookingsValidation,
  createBookingValidation,
  statusValidation,
};