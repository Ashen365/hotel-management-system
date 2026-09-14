const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ApiError = require('../utils/ApiError');
const { toLocalMidnight, nightsBetween } = require('../utils/dateUtils');
const { STAFF_ROLES } = require('../constants/roles');

const POPULATE = [
  { path: 'room', select: 'number type pricePerNight capacity status' },
  { path: 'user', select: 'name email role' },
];

// Overlap rule: two date ranges conflict when one starts before the other ends.
// Adjacent stays (checkOut === other checkIn) are fine.
const isPeriodOverlapping = (a1, a2, b1, b2) => a1 < b2 && b1 < a2;

// Allowed status moves. Anything not listed here is rejected.
const TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const canViewBooking = (req, booking) =>
  STAFF_ROLES.includes(req.user.role) ||
  booking.user._id.toString() === req.user._id.toString();

// GET /api/bookings - protect
// Guests see only their own. Staff see all (filterable by status/room).
const getBookings = async (req, res, next) => {
  const filter = {};
  if (!STAFF_ROLES.includes(req.user.role)) {
    filter.user = req.user._id;
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.room) filter.room = req.query.room;

  const bookings = await Booking.find(filter)
    .populate(POPULATE)
    .sort({ checkIn: -1 });

  res.status(200).json({ success: true, count: bookings.length, data: { bookings } });
};

// GET /api/bookings/:id - protect (owner or staff)
const getBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate(POPULATE);

  if (!booking) {
    return next(new ApiError(404, 'Booking not found'));
  }
  if (!canViewBooking(req, booking)) {
    return next(new ApiError(403, 'Not your booking'));
  }

  res.status(200).json({ success: true, data: { booking } });
};

// POST /api/bookings - protect (any authenticated user)
// Creates a 'pending' booking ONLY if the room is free for the full range.
const createBooking = async (req, res, next) => {
  const { roomId, checkIn, checkOut, guests } = req.body;

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    return next(new ApiError(404, 'Room not found'));
  }
  if (room.status === 'maintenance') {
    return next(new ApiError(400, 'Room is under maintenance and not bookable'));
  }

  const start = toLocalMidnight(checkIn);
  const end = toLocalMidnight(checkOut);

  if (start >= end) {
    return next(new ApiError(400, 'Check-out must be after check-in'));
  }
  if (start < toLocalMidnight(new Date())) {
    return next(new ApiError(400, 'Check-in cannot be in the past'));
  }
  if (guests > room.capacity) {
    return next(new ApiError(400, `Room fits ${room.capacity} guests`));
  }

  const nights = nightsBetween(start, end);
  const totalPrice = room.pricePerNight * nights;

  const overlap = await Booking.findOne({
    room: room._id,
    status: { $in: ['pending', 'confirmed'] },
    $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }],
  });

  if (overlap) {
    return next(new ApiError(409, 'Room is already booked for these dates'));
  }

  const booking = await Booking.create({
    room: room._id,
    user: req.user._id,
    checkIn: start,
    checkOut: end,
    guests,
    totalPrice,
    status: 'pending',
  });

  const populated = await Booking.findById(booking._id).populate(POPULATE);

  res.status(201).json({
    success: true,
    message: 'Booking requested',
    data: { booking: populated },
  });
};

// PATCH /api/bookings/:id/status - protect
// Owner: can only cancel their own pending/confirmed booking.
// Staff: can run the full transition table (confirm, complete, cancel).
const updateBookingStatus = async (req, res, next) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id).populate(POPULATE);
  if (!booking) {
    return next(new ApiError(404, 'Booking not found'));
  }

  if (!canViewBooking(req, booking)) {
    return next(new ApiError(403, 'Not your booking'));
  }

  const allowed = TRANSITIONS[booking.status] || [];
  if (!allowed.includes(status)) {
    return next(new ApiError(400, `Cannot change booking from ${booking.status} to ${status}`));
  }

  // Guests may only cancel; confirming/completing is staff work.
  if (!STAFF_ROLES.includes(req.user.role) && status !== 'cancelled') {
    return next(new ApiError(403, 'Guests can only cancel their own booking'));
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: `Booking marked ${status}`,
    data: { booking },
  });
};

// DELETE /api/bookings/:id - admin/manager only
const deleteBooking = async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new ApiError(404, 'Booking not found'));
  }

  res.status(200).json({ success: true, message: 'Booking deleted', data: {} });
};

module.exports = { getBookings, getBooking, createBooking, updateBookingStatus, deleteBooking };