const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/jwt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    rfxBalance: 10, // Welcome bonus
  });

  if (user) {
    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        rfxBalance: user.rfxBalance,
        co2Saved: user.co2Saved,
        xp: user.xp,
        level: user.level, // Assuming level is derived from XP or a separate field
        achievements: user.achievements,
        referralCode: user.referralCode,
        avatar: user.avatar,
        joinedAt: user.joinedAt,
      },
      message: "Account created successfully. Welcome bonus applied."
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password'); // Select password to compare

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        rfxBalance: user.rfxBalance,
        co2Saved: user.co2Saved,
        xp: user.xp,
        level: user.level, // Assuming level is derived from XP or a separate field
        achievements: user.achievements,
        referralCode: user.referralCode,
        avatar: user.avatar,
        joinedAt: user.joinedAt,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User with that email not found');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // Save user with new token

  // Create reset URL (frontend will use this)
  const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // In a real app, you would send this email using a service like Nodemailer
  console.log(`Password Reset URL: ${resetURL}`); // For development/testing

  res.status(200).json({
    success: true,
    message: 'Password reset email sent (check console for URL)',
    resetToken: resetToken // For testing, remove in production
  });
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash URL token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
