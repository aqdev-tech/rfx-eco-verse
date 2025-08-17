const asyncHandler = require('express-async-handler');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({});
  res.json(campaigns);
});

// @desc    Get single campaign details
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    res.json(campaign);
  } else {
    res.status(404);
    throw new Error('Campaign not found');
  }
});

// @desc    Participate in a campaign
// @route   POST /api/campaigns/:id/participate
// @access  Private
const participateInCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // In a real app, you'd add logic to check if user already participated
  // and update campaign's participants count.
  campaign.participantsCount += 1; // Simple increment
  await campaign.save();

  res.json({ message: 'Successfully joined campaign.' });
});

// @desc    Record eco action in a campaign
// @route   POST /api/campaigns/:id/record-action
// @access  Private
const recordCampaignAction = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  const user = await User.findById(req.user.id);
  const { actionType, quantity } = req.body; // Example: actionType='tree_planted', quantity=1

  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Calculate rewards based on action and campaign settings
  const rfxEarned = campaign.rfxRewardPerAction * (quantity || 1);
  const co2Saved = campaign.co2ImpactPerAction * (quantity || 1);

  user.rfxBalance += rfxEarned;
  user.co2Saved += co2Saved;
  await user.save();

  // Record transaction
  await Transaction.create({
    user: user._id,
    type: 'earning',
    amount: rfxEarned,
    currency: 'RFX',
    description: `Earned from ${actionType} in ${campaign.title}`,
    relatedEntity: campaign._id,
    onModel: 'Campaign',
  });

  res.json({
    message: 'Action recorded. RFX and CO2 impact updated.',
    rfxEarned,
    co2Saved,
    newRfxBalance: user.rfxBalance,
    newCo2Saved: user.co2Saved,
  });
});

module.exports = {
  getCampaigns,
  getCampaignById,
  participateInCampaign,
  recordCampaignAction,
};
