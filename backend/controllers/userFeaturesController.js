const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Get user wallet balance and transactions
// @route   GET /api/user/wallet
// @access  Private
const getWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('rfxBalance');
  const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

  if (user) {
    res.json({
      rfxBalance: user.rfxBalance,
      transactions,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user referral details and rewards
// @route   GET /api/user/referrals
// @access  Private
const getReferrals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('referralCode');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const referredUsers = await User.find({ referredBy: req.user.id }).select('username joinedAt');
  const referredUsersCount = referredUsers.length;

  const referralBonuses = await Transaction.find({ user: req.user.id, type: 'referral_bonus' });
  const totalEarnedFromReferrals = referralBonuses.reduce((acc, bonus) => acc + bonus.amount, 0);

  res.json({
    referralCode: user.referralCode || 'GENERATE_CODE',
    referralLink: `https://rfx-ecoverse.com/signup?ref=${user.referralCode || 'GENERATE_CODE'}`,
    referredUsersCount,
    totalEarnedFromReferrals,
    referredUsers: referredUsers.map(u => ({ ...u.toObject(), status: 'active' })),
  });
});

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Mark one notification as read
// @route   PATCH /api/user/notifications/:id/read
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });

  if (notification) {
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/user/notifications/mark-all-read
// @access  Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = {
  getWallet,
  getReferrals,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};