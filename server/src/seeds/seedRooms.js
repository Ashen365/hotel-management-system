// Demo room data. Run with: npm run seed:rooms
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Room = require('../models/Room');

dotenv.config({ quiet: true });

const rooms = [
  {
    number: '101',
    type: 'standard',
    pricePerNight: 80,
    capacity: 2,
    amenities: ['WiFi', 'Air conditioning', 'TV'],
    description: 'Comfortable single/double bed room with garden view.',
  },
  {
    number: '102',
    type: 'standard',
    pricePerNight: 95,
    capacity: 2,
    status: 'occupied',
    amenities: ['WiFi', 'Air conditioning', 'TV', 'Mini fridge'],
    description: 'Larger standard room with a work desk and city view.',
  },
  {
    number: '201',
    type: 'deluxe',
    pricePerNight: 150,
    capacity: 3,
    amenities: ['WiFi', 'Air conditioning', 'TV', 'Mini bar', 'Bathrobe'],
    description: 'Deluxe room with king bed and access to the lounge.',
  },
  {
    number: '202',
    type: 'deluxe',
    pricePerNight: 165,
    capacity: 3,
    amenities: ['WiFi', 'Air conditioning', 'TV', 'Mini bar', 'Balcony'],
    description: 'Corner deluxe room with a private balcony overlooking the pool.',
  },
  {
    number: '301',
    type: 'suite',
    pricePerNight: 220,
    capacity: 4,
    amenities: ['WiFi', 'Air conditioning', 'Living area', 'Mini bar', 'Bathtub'],
    description: 'One-bedroom suite with separate living room.',
  },
  {
    number: '302',
    type: 'suite',
    pricePerNight: 240,
    capacity: 4,
    amenities: ['WiFi', 'Air conditioning', 'Living area', 'Kitchenette'],
    description: 'Family suite with kitchenette ideal for longer stays.',
  },
  {
    number: '401',
    type: 'family',
    pricePerNight: 180,
    capacity: 5,
    amenities: ['WiFi', 'Air conditioning', 'TV', 'Kids play area'],
    description: 'Spacious family room with bunk bed option on request.',
  },
  {
    number: '501',
    type: 'executive',
    pricePerNight: 280,
    capacity: 2,
    amenities: ['WiFi', 'Air conditioning', 'Business desk', 'Nespresso machine'],
    description: 'Executive room with fast WiFi and a dedicated workspace.',
  },
  {
    number: '502',
    type: 'executive',
    pricePerNight: 300,
    capacity: 2,
    status: 'maintenance',
    amenities: ['WiFi', 'Air conditioning', 'Business desk', 'Skyline view'],
    description: 'Top-floor executive room undergoing refurbishment.',
  },
  {
    number: '601',
    type: 'presidential',
    pricePerNight: 450,
    capacity: 4,
    amenities: ['WiFi', 'Air conditioning', 'Private terrace', 'Jacuzzi', 'Butler service'],
    description: 'Presidential suite with panoramic views and butler service.',
  },
  {
    number: '701',
    type: 'villa',
    pricePerNight: 350,
    capacity: 4,
    amenities: ['Private pool', 'WiFi', 'Air conditioning', 'Kitchen', 'Garden'],
    description: 'Private villa with its own pool and garden.',
  },
  {
    number: '702',
    type: 'villa',
    pricePerNight: 380,
    capacity: 6,
    amenities: ['Private pool', 'WiFi', 'Air conditioning', 'BBQ area', 'Beach access'],
    description: 'Beachfront villa that sleeps up to six guests.',
  },
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    const created = await Room.insertMany(rooms);
    console.log(`Seeded ${created.length} rooms`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedRooms();