const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (user) {
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      rfxBalance: user.rfxBalance,
      co2Saved: user.co2Saved,
      xp: user.xp,
      level: user.level, // Assuming level is derived or a field
      achievements: user.achievements,
      referralCode: user.referralCode,
      avatar: user.avatar,
      joinedAt: user.joinedAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PATCH /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    // Add other fields that can be updated by the user

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        rfxBalance: updatedUser.rfxBalance,
        co2Saved: updatedUser.co2Saved,
        xp: updatedUser.xp,
        level: updatedUser.level, // Assuming level is derived or a field
        achievements: updatedUser.achievements,
        referralCode: updatedUser.referralCode,
        avatar: updatedUser.avatar,
        joinedAt: updatedUser.joinedAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
};
