const mongoose = require('mongoose');

const HOUSEKEEPING_STATUSES = ['pending', 'in_progress', 'completed'];

const housekeepingTaskSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: HOUSEKEEPING_STATUSES,
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema);
module.exports.HOUSEKEEPING_STATUSES = HOUSEKEEPING_STATUSES;