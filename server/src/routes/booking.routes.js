const express = require('express');

const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  idParamValidation,
  listBookingsValidation,
  createBookingValidation,
  statusValidation,
} = require('../validators/booking.validators');

const router = express.Router();

router.get('/', protect, listBookingsValidation, validate, bookingController.getBookings);
router.get('/:id', protect, idParamValidation, validate, bookingController.getBooking);
router.post('/', protect, createBookingValidation, validate, bookingController.createBooking);
router.patch(
  '/:id/status',
  protect,
  idParamValidation,
  statusValidation,
  validate,
  bookingController.updateBookingStatus
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  idParamValidation,
  validate,
  bookingController.deleteBooking
);

module.exports = router;