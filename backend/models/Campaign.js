const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  status: {
    type: String,
    enum: ['active', 'upcoming', 'completed', 'pending'],
    default: 'pending',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  rfxRewardPerAction: {
    type: Number,
    default: 0,
  },
  co2ImpactPerAction: {
    type: Number,
    default: 0,
  },
  participantsCount: {
    type: Number,
    default: 0,
  },
  targetParticipants: {
    type: Number,
    default: 0,
  },
  // Add other relevant fields like location, type of campaign, etc.
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
