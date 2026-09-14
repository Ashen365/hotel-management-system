// Demo bookings. Run with: npm run seed:bookings
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

dotenv.config({ quiet: true });

const addDays = (days) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

const seedBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const guest = await User.findOne({ email: 'guest@test.com' });
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (!guest || !admin) {
      console.log('Test users not found -> skip (create them first via registration or dev seeding)');
      await mongoose.disconnect();
      process.exit(0);
    }

    const byNumber = async (n) => {
      const room = await Room.findOne({ number: n });
      if (!room) throw new Error(`Room ${n} not found - run seed:rooms first`);
      return room;
    };

    await Booking.deleteMany({});
    console.log('Cleared existing bookings');

    const bookings = [
      {
        room: await byNumber('101'),
        user: guest,
        checkIn: addDays(0),
        checkOut: addDays(2),
        guests: 2,
        status: 'confirmed',
      },
      {
        room: await byNumber('201'),
        user: guest,
        checkIn: addDays(3),
        checkOut: addDays(5),
        guests: 2,
        status: 'pending',
      },
      {
        room: await byNumber('301'),
        user: admin,
        checkIn: addDays(7),
        checkOut: addDays(10),
        guests: 3,
        status: 'confirmed',
      },
    ];

    for (const b of bookings) {
      b.totalPrice = b.room.pricePerNight * ((b.checkOut - b.checkIn) / (24 * 60 * 60 * 1000));
      await Booking.create(b);
    }

    console.log(`Seeded ${bookings.length} bookings`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedBookings();