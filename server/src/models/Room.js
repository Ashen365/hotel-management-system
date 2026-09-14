const mongoose = require('mongoose');

// Shared constants (re-used by validators + seed)
const ROOM_TYPES = [
  'standard',
  'deluxe',
  'suite',
  'family',
  'executive',
  'presidential',
  'villa',
];

const ROOM_STATUSES = ['available', 'occupied', 'reserved', 'maintenance'];

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: ROOM_TYPES,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ROOM_STATUSES,
      default: 'available',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
module.exports.ROOM_TYPES = ROOM_TYPES;
module.exports.ROOM_STATUSES = ROOM_STATUSES;