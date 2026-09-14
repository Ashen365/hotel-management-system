const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
// Self-registration always creates a GUEST.
// Staff/admin accounts are created by admins (user-management feature).
const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(409, 'User already exists'));
  }

  const user = await User.create({ name, email, password, role: 'guest' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    },
  });
};

// POST /api/auth/login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // select('+password') re-includes the field hidden by select:false
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  if (!user.isActive) {
    return next(new ApiError(401, 'Account is deactivated'));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    },
  });
};

// GET /api/auth/me - protected
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user retrieved',
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };