const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Game = require('../models/Game');
const Notification = require('../models/Notification');
const Submission = require('../models/Submission');
const Transaction = require('../models/Transaction');
const PlatformSetting = require('../models/PlatformSetting');

// @desc    Get user dashboard summary
// @route   GET /api/user/dashboard-summary
// @access  Private
const getUserDashboardSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Mock data for active campaigns, new games, recent activity
  const activeCampaigns = await Campaign.find({ status: 'active' }).limit(2);
  const newGames = await Game.find({ status: 'active' }).sort({ createdAt: -1 }).limit(2);
  const recentActivity = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(4);

  res.json({
    rfxBalance: user.rfxBalance,
    co2Saved: user.co2Saved,
    level: user.level, // Assuming level is a field or derived
    xp: user.xp,
    achievementsCount: user.achievements.length,
    activeCampaigns: activeCampaigns.map(c => ({ id: c._id, title: c.title, status: c.status })),
    newGames: newGames.map(g => ({ id: g._id, name: g.name, status: g.status })),
    referralBonusInfo: { amount: 25, currency: 'RFX' }, // Hardcoded for now
    recentActivity: recentActivity.map(t => ({
      action: t.description,
      reward: `${t.amount} ${t.currency}`,
      time: t.createdAt,
      type: t.onModel ? t.onModel.toLowerCase() : 'transaction',
    })),
  });
});

// @desc    Get admin dashboard summary
// @route   GET /api/admin/dashboard-summary
// @access  Private/Admin
const getAdminDashboardSummary = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const activeCampaignsCount = await Campaign.countDocuments({ status: 'active' });
  const pendingCampaignApprovalsCount = await Campaign.countDocuments({ status: 'pending' });
  const pendingReviewsCount = await Submission.countDocuments({ status: 'pending' });
  // For completed submissions today, you'd need a createdAt filter for today
  const completedSubmissionsTodayCount = 87; // Mock data

  res.json({
    totalUsers,
    newUsersLastMonthPercentage: 8.2, // Mock data
    activeCampaignsCount,
    pendingCampaignApprovalsCount,
    pendingReviewsCount,
    completedSubmissionsTodayCount,
  });
});

// @desc    Get super admin dashboard summary
// @route   GET /api/super-admin/dashboard-summary
// @access  Private/SuperAdmin
const getSuperAdminDashboardSummary = asyncHandler(async (req, res) => {
  const totalPlatformUsers = await User.countDocuments({});
  const rfxTokensDistributed = await Transaction.aggregate([
    { $match: { type: { $in: ['earning', 'bonus', 'referral_bonus'] }, currency: 'RFX' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const platformRevenueMonthly = 45200; // Mock data
  const systemUptimePercentage = 99.9; // Mock data
  const dailyRewardAmount = (await PlatformSetting.findOne({ key: 'dailyRewardAmount' }))?.value || 5;
  const campaignRewardLimit = (await PlatformSetting.findOne({ key: 'campaignRewardLimit' }))?.value || 500;
  const referralBonus = (await PlatformSetting.findOne({ key: 'referralBonus' }))?.value || 25;
  const maintenanceMode = (await PlatformSetting.findOne({ key: 'maintenanceMode' }))?.value || 'Active';
  const databaseTotalRecords = 847000; // Mock data
  const databaseStorageUsedGB = 2.3; // Mock data
  const databaseQueryPerformance = 'Optimal'; // Mock data
  const activeSessions = 3247; // Mock data
  const countriesCount = 89; // Mock data
  const peakConcurrentUsers = 8921; // Mock data
  const sslStatus = 'OK'; // Mock data
  const firewallStatus = 'OK'; // Mock data
  const threatsBlockedCount = 247; // Mock data
  const alerts = [
    { type: 'warning', message: 'High Token Distribution Rate', details: 'Daily RFX distribution exceeding 95% of daily limit' },
    { type: 'info', message: 'System Backup Completed', details: 'Automated daily backup successful at 3:00 AM UTC' }
  ]; // Mock data

  res.json({
    totalPlatformUsers,
    newUsersLastMonthPercentage: 18.2, // Mock data
    rfxTokensDistributed: rfxTokensDistributed[0] ? rfxTokensDistributed[0].total : 0,
    platformRevenueMonthly,
    systemUptimePercentage,
    dailyRewardAmount,
    campaignRewardLimit,
    referralBonus,
    maintenanceMode,
    databaseTotalRecords,
    databaseStorageUsedGB,
    databaseQueryPerformance,
    activeSessions,
    countriesCount,
    peakConcurrentUsers,
    sslStatus,
    firewallStatus,
    threatsBlockedCount,
    alerts,
  });
});

module.exports = {
  getUserDashboardSummary,
  getAdminDashboardSummary,
  getSuperAdminDashboardSummary,
};
