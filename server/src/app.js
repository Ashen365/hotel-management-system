const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const housekeepingRoutes = require('./routes/housekeeping.routes');
const userRoutes = require('./routes/user.routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

dotenv.config({ quiet: true });

const app = express();

// Allow requests only from our frontend (Vite dev server)
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// Parse incoming JSON request bodies
app.use(express.json());

// ---- API routes ----
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/users', userRoutes);

// ---- Error handling (always last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;