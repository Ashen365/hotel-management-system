// Demo housekeeping tasks. Run with: npm run seed:housekeeping
// Requires rooms (seed:rooms) and at least one 'housekeeping'-role user.
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const HousekeepingTask = require('../models/HousekeepingTask');
const Room = require('../models/Room');
const User = require('../models/User');

dotenv.config({ quiet: true });

const addDays = (days) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

const seedHousekeeping = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const housekeeper = await User.findOne({ role: 'housekeeping' });
    if (!housekeeper) {
      console.log('No housekeeping-role user found -> skip (create one first)');
      await mongoose.disconnect();
      process.exit(0);
    }

    const byNumber = async (n) => {
      const room = await Room.findOne({ number: n });
      if (!room) throw new Error(`Room ${n} not found - run seed:rooms first`);
      return room;
    };

    await HousekeepingTask.deleteMany({});
    console.log('Cleared existing housekeeping tasks');

    const tasks = [
      {
        room: await byNumber('102'),
        assignedTo: housekeeper,
        status: 'pending',
        notes: 'Guest left early - full turnaround',
        dueDate: addDays(0),
      },
      {
        room: await byNumber('401'),
        assignedTo: housekeeper,
        status: 'pending',
        notes: 'Deep clean balcony',
        dueDate: addDays(0),
      },
      {
        room: await byNumber('301'),
        assignedTo: housekeeper,
        status: 'completed',
        notes: 'Standard refresh',
        dueDate: addDays(-1),
        completedAt: addDays(-1),
      },
    ];

    for (const t of tasks) {
      t.createdBy = housekeeper;
      await HousekeepingTask.create(t);
    }

    console.log(`Seeded ${tasks.length} housekeeping tasks`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedHousekeeping();