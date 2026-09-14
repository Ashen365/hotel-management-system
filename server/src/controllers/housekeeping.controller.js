const HousekeepingTask = require('../models/HousekeepingTask');
const Room = require('../models/Room');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { toLocalMidnight } = require('../utils/dateUtils');

const POPULATE = [
  { path: 'room', select: 'number type pricePerNight capacity status' },
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email' },
];

// GET /api/housekeeping/tasks - staff (housekeeping family)
const getTasks = async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const tasks = await HousekeepingTask.find(filter)
    .populate(POPULATE)
    .sort({ dueDate: 1, createdAt: -1 });

  res.status(200).json({ success: true, count: tasks.length, data: { tasks } });
};

// POST /api/housekeeping/tasks - staff (housekeeping family)
const createTask = async (req, res, next) => {
  const { roomId, assignedTo, notes, dueDate } = req.body;

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    return next(new ApiError(404, 'Room not found'));
  }

  if (assignedTo) {
    const assignee = await User.findById(assignedTo).select('role');
    if (!assignee) {
      return next(new ApiError(404, 'Assigned staff not found'));
    }
  }

  const task = await HousekeepingTask.create({
    room: roomId,
    assignedTo: assignedTo || undefined,
    notes: notes || undefined,
    dueDate: dueDate ? toLocalMidnight(dueDate) : toLocalMidnight(new Date()),
    createdBy: req.user._id,
  });

  const populated = await HousekeepingTask.findById(task._id).populate(POPULATE);

  res.status(201).json({ success: true, message: 'Task created', data: { task: populated } });
};

// PATCH /api/housekeeping/tasks/:id - staff (housekeeping family)
// Completing a task marks the room available again (unless it is under maintenance).
const updateTask = async (req, res, next) => {
  const { status, assignedTo, notes, dueDate } = req.body;

  const task = await HousekeepingTask.findById(req.params.id);
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }

  if (status) {
    if (task.status === 'completed' && status !== 'completed') {
      return next(new ApiError(400, 'Completed tasks cannot be reopened'));
    }
    task.status = status;

    if (status === 'completed') {
      task.completedAt = new Date();
      const room = await Room.findById(task.room);
      // Cleaning makes a stayable room bookable again; maintenance stays off-alert.
      if (room && room.status !== 'maintenance') {
        room.status = 'available';
        await room.save();
      }
    }
  }

  if (assignedTo) {
    const assignee = await User.findById(assignedTo).select('role');
    if (!assignee) {
      return next(new ApiError(404, 'Assigned staff not found'));
    }
    task.assignedTo = assignedTo;
  }
  if (notes !== undefined) task.notes = notes;
  if (dueDate) task.dueDate = toLocalMidnight(dueDate);

  await task.save();
  const populated = await HousekeepingTask.findById(task._id).populate(POPULATE);

  res.status(200).json({
    success: true,
    message: status ? `Task marked ${status}` : 'Task updated',
    data: { task: populated },
  });
};

// DELETE /api/housekeeping/tasks/:id - admin/manager only
const deleteTask = async (req, res, next) => {
  const task = await HousekeepingTask.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }

  res.status(200).json({ success: true, message: 'Task deleted', data: {} });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };