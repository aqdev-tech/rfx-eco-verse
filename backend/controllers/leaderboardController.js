const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get leaderboard data
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  const { sortBy = 'xp', limit = 10, offset = 0 } = req.query;

  let sortCriteria = {};
  if (sortBy === 'xp') {
    sortCriteria = { xp: -1 };
  } else if (sortBy === 'rfx') {
    sortCriteria = { rfxBalance: -1 };
  } else if (sortBy === 'co2') {
    sortCriteria = { co2Saved: -1 };
  } else {
    res.status(400);
    throw new Error('Invalid sortBy parameter. Must be xp, rfx, or co2.');
  }

  const leaderboard = await User.find({})
    .sort(sortCriteria)
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .select('username avatar xp rfxBalance co2Saved level');

  res.json(leaderboard);
});

module.exports = {
  getLeaderboard,
};
