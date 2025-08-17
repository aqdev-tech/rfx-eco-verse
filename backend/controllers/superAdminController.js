const asyncHandler = require('express-async-handler');
const PlatformSetting = require('../models/PlatformSetting');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction model

// --- Dashboard Summary ---
const getDashboardSummary = asyncHandler(async (req, res) => {
  const totalPlatformUsers = await User.countDocuments({});

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newUsersLastMonth = await User.countDocuments({ joinedAt: { $gte: oneMonthAgo } });
  const totalUsersBeforeLastMonth = totalPlatformUsers - newUsersLastMonth;
  const newUsersLastMonthPercentage = totalUsersBeforeLastMonth > 0 ? ((newUsersLastMonth / totalUsersBeforeLastMonth) * 100).toFixed(2) : 0;

  const rfxTokensDistributedResult = await Transaction.aggregate([
    { $match: { type: { $in: ['earning', 'bonus', 'referral_bonus'] }, currency: 'RFX' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const rfxTokensDistributed = rfxTokensDistributedResult.length > 0 ? rfxTokensDistributedResult[0].total : 0;

  // Fetch platform settings
  const dailyRewardAmountSetting = await PlatformSetting.findOne({ key: 'dailyRewardAmount' });
  const campaignRewardLimitSetting = await PlatformSetting.findOne({ key: 'campaignRewardLimit' });
  const referralBonusSetting = await PlatformSetting.findOne({ key: 'referralBonus' });
  const maintenanceModeSetting = await PlatformSetting.findOne({ key: 'maintenanceMode' });

  // Dynamic/Placeholder data for previously mocked fields
  const platformRevenueMonthly = Math.floor(Math.random() * (50000 - 30000 + 1)) + 30000; // Random between 30k-50k
  const systemUptimePercentage = (99.5 + Math.random() * 0.5).toFixed(2); // Random between 99.5-100
  const databaseTotalRecords = Math.floor(Math.random() * (900000 - 700000 + 1)) + 700000; // Random between 700k-900k
  const databaseStorageUsedGB = (2.0 + Math.random() * 1.0).toFixed(1); // Random between 2.0-3.0
  const databaseQueryPerformance = Math.random() > 0.1 ? 'Optimal' : 'Degraded'; // 90% optimal
  const activeSessions = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000; // Random between 2k-4k
  const countriesCount = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // Random between 50-100
  const peakConcurrentUsers = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // Random between 5k-10k
  const sslStatus = 'OK'; // Placeholder
  const firewallStatus = 'OK'; // Placeholder
  const threatsBlockedCount = Math.floor(Math.random() * 500); // Random up to 500
  const alerts = []; // Empty array, real alerts would be dynamic

  res.json({
    totalPlatformUsers,
    newUsersLastMonthPercentage,
    rfxTokensDistributed,
    platformRevenueMonthly,
    systemUptimePercentage,
    dailyRewardAmount: dailyRewardAmountSetting ? dailyRewardAmountSetting.value : 0,
    campaignRewardLimit: campaignRewardLimitSetting ? campaignRewardLimitSetting.value : 0,
    referralBonus: referralBonusSetting ? referralBonusSetting.value : 0,
    maintenanceMode: maintenanceModeSetting ? maintenanceModeSetting.value : 'N/A',
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

// --- Platform Settings ---

// @desc    Get platform settings
// @route   GET /api/super-admin/settings
// @access  Private/SuperAdmin
const getPlatformSettings = asyncHandler(async (req, res) => {
  const settings = await PlatformSetting.find({});
  res.json(settings);
});

// @desc    Update platform settings
// @route   PATCH /api/super-admin/settings
// @access  Private/SuperAdmin
const updatePlatformSettings = asyncHandler(async (req, res) => {
  const { key, value, description } = req.body;

  let setting = await PlatformSetting.findOne({ key });

  if (setting) {
    setting.value = value;
    setting.description = description || setting.description;
    await setting.save();
    res.json(setting);
  } else {
    setting = await PlatformSetting.create({
      key,
      value,
      description,
    });
    res.status(201).json(setting);
  }
});

// --- Admin Management ---

// @desc    Get all admins
// @route   GET /api/super-admin/admins
// @access  Private/SuperAdmin
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } }).select('-password');
  res.json(admins);
});

// @desc    Get single admin by ID
// @route   GET /api/super-admin/admins/:id
// @access  Private/SuperAdmin
const getAdminById = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id).select('-password');

  if (admin && (admin.role === 'admin' || admin.role === 'super_admin')) {
    res.json(admin);
  } else {
    res.status(404);
    throw new Error('Admin user not found');
  }
});

// @desc    Add a new admin
// @route   POST /api/super-admin/admins
// @access  Private/SuperAdmin
const addAdmin = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    role: role || 'admin', // Default to admin if not specified
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update an admin's information
// @route   PATCH /api/super-admin/admins/:id
// @access  Private/SuperAdmin
const updateAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role; // Allow changing role

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Admin user not found');
  }
});

// @desc    Remove an admin
// @route   DELETE /api/super-admin/admins/:id
// @access  Private/SuperAdmin
const removeAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent super_admin from deleting themselves or the last super_admin
    if (user.role === 'super_admin' && (await User.countDocuments({ role: 'super_admin' })) === 1) {
      res.status(400);
      throw new Error('Cannot remove the last super admin');
    }
    // Change role to user instead of deleting, or delete if desired
    user.role = 'user';
    await user.save();
    res.json({ message: 'Admin role removed, user demoted to regular user' });
  } else {
    res.status(404);
    throw new Error('Admin user not found');
  }
});

module.exports = {
  getDashboardSummary,
  getPlatformSettings,
  updatePlatformSettings,
  getAdmins,
  getAdminById, // Added getAdminById to exports
  addAdmin,
  updateAdmin,
  removeAdmin,
};