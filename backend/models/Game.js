const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  genre: {
    type: String,
  },
  rfxReward: {
    type: Number,
    default: 0,
  },
  xpReward: { // Added XP reward for games
    type: Number,
    default: 0,
  },
  co2SavedPerPlay: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  // Add other relevant fields like game URL, min/max score, etc.
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
