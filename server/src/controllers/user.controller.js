const User = require('../models/User');

// GET /api/users - staff only (for assignments, contact lists, etc.)
// Optional ?role= filter (e.g. ?role=housekeeping)
const getUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter)
    .select('name email role isActive')
    .sort({ name: 1 });

  res.status(200).json({ success: true, count: users.length, data: { users } });
};

module.exports = { getUsers };