const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Submission = require('../models/Submission');

// --- Dashboard Summary ---
const getDashboardSummary = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newUsersLastMonth = await User.countDocuments({ joinedAt: { $gte: oneMonthAgo } });
  const totalUsersLastMonth = totalUsers - newUsersLastMonth;
  const newUsersLastMonthPercentage = totalUsersLastMonth > 0 ? (newUsersLastMonth / totalUsersLastMonth) * 100 : 0;

  const activeCampaignsCount = await Campaign.countDocuments({ status: 'active' });
  const pendingCampaignApprovalsCount = await Campaign.countDocuments({ status: 'pending' });

  const pendingReviewsCount = await Submission.countDocuments({ status: 'pending' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedSubmissionsTodayCount = await Submission.countDocuments({ status: 'approved', updatedAt: { $gte: today } });

  res.json({
    totalUsers,
    newUsersLastMonthPercentage: newUsersLastMonthPercentage.toFixed(0),
    activeCampaignsCount,
    pendingCampaignApprovalsCount,
    pendingReviewsCount,
    completedSubmissionsTodayCount,
  });
});


// --- User Management ---

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get user by ID (for admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user info/role (for admin)
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role; // Allow admin to change role
    user.rfxBalance = req.body.rfxBalance || user.rfxBalance;
    user.co2Saved = req.body.co2Saved || user.co2Saved;
    user.xp = req.body.xp || user.xp;
    user.achievements = req.body.achievements || user.achievements;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      rfxBalance: updatedUser.rfxBalance,
      co2Saved: updatedUser.co2Saved,
      xp: updatedUser.xp,
      achievements: updatedUser.achievements,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (for admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- Campaign Management ---

// @desc    Get all campaigns (for admin)
// @route   GET /api/admin/campaigns
// @access  Private/Admin
const getAdminCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({});
  res.json(campaigns);
});

// @desc    Create new campaign (for admin)
// @route   POST /api/admin/campaigns
// @access  Private/Admin
const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, rfxRewardPerAction, co2ImpactPerAction, targetParticipants } = req.body;

  const campaign = await Campaign.create({
    title,
    description,
    startDate,
    endDate,
    rfxRewardPerAction,
    co2ImpactPerAction,
    targetParticipants,
    status: 'pending', // New campaigns start as pending approval
  });

  res.status(201).json(campaign);
});

// @desc    Update campaign (for admin)
// @route   PATCH /api/admin/campaigns/:id
// @access  Private/Admin
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    campaign.title = req.body.title || campaign.title;
    campaign.description = req.body.description || campaign.description;
    campaign.status = req.body.status || campaign.status;
    campaign.startDate = req.body.startDate || campaign.startDate;
    campaign.endDate = req.body.endDate || campaign.endDate;
    campaign.rfxRewardPerAction = req.body.rfxRewardPerAction || campaign.rfxRewardPerAction;
    campaign.co2ImpactPerAction = req.body.co2ImpactPerAction || campaign.co2ImpactPerAction;
    campaign.targetParticipants = req.body.targetParticipants || campaign.targetParticipants;

    const updatedCampaign = await campaign.save();
    res.json(updatedCampaign);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Delete campaign (for admin)
// @route   DELETE /api/admin/campaigns/:id
// @access  Private/Admin
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    await campaign.deleteOne();
    res.json({ message: 'Campaign removed' });
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// --- Submission Management ---

// @desc    Get pending submissions (for admin)
// @route   GET /api/admin/submissions/pending
// @access  Private/Admin
const getPendingSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ status: 'pending' }).populate('user', 'username email').populate('campaign', 'title');
  res.json(submissions);
});

// @desc    Approve submission (for admin)
// @route   POST /api/admin/submissions/:id/approve
// @access  Private/Admin
const approveSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (submission) {
    submission.status = 'approved';
    await submission.save();
    // Here you might want to award RFX/XP to the user for the approved submission
    res.json({ message: 'Submission approved' });
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

// @desc    Reject submission (for admin)
// @route   POST /api/admin/submissions/:id/reject
// @access  Private/Admin
const rejectSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (submission) {
    submission.status = 'rejected';
    submission.adminNotes = req.body.adminNotes || 'Rejected by admin';
    await submission.save();
    res.json({ message: 'Submission rejected' });
  } else {
    res.status(404);
    throw new Error('Submission not found');
  }
});

module.exports = {
  getDashboardSummary,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
};
