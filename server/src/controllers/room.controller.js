const Room = require('../models/Room');
const ApiError = require('../utils/ApiError');

// GET /api/rooms - public
// Optional query filters: type, status, available, minPrice, maxPrice, capacity, search
const getRooms = async (req, res, next) => {
  const { type, status, available, minPrice, maxPrice, capacity, search } = req.query;

  const filter = { isActive: true };

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (available === 'true') filter.status = 'available';

  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }

  if (capacity) filter.capacity = { $gte: Number(capacity) };

  if (search) {
    filter.$or = [
      { number: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },
    ];
  }

  const rooms = await Room.find(filter).sort({ pricePerNight: 1 });

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: { rooms },
  });
};

// GET /api/rooms/:id - public
const getRoom = async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room || !room.isActive) {
    return next(new ApiError(404, 'Room not found'));
  }

  res.status(200).json({
    success: true,
    data: { room },
  });
};

// POST /api/rooms - admin/manager only
const createRoom = async (req, res, next) => {
  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Room created',
    data: { room },
  });
};

// PUT /api/rooms/:id - admin/manager only
// Sends back only the fields present in the request body (partial update).
const updateRoom = async (req, res, next) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!room) {
    return next(new ApiError(404, 'Room not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Room updated',
    data: { room },
  });
};

// DELETE /api/rooms/:id - admin/manager only
// Hard delete for now; could become a soft delete (isActive: false) later.
const deleteRoom = async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);

  if (!room) {
    return next(new ApiError(404, 'Room not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Room deleted',
    data: {},
  });
};

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom };