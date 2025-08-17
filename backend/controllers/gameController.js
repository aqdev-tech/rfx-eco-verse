const asyncHandler = require('express-async-handler');
const Game = require('../models/Game');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
const getGames = asyncHandler(async (req, res) => {
  const games = await Game.find({});
  res.json(games);
});

// @desc    Record gameplay and award RFX/XP
// @route   POST /api/games/:id/play
// @access  Private
const recordGamePlay = asyncHandler(async (req, res) => {
  const gameId = req.params.id;
  const { score, duration } = req.body; // Optional: score and duration

  const game = await Game.findById(gameId);
  const user = await User.findById(req.user.id);

  if (!game) {
    res.status(404);
    throw new Error('Game not found');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Award RFX and XP
  const rfxEarned = game.rfxReward;
  const xpEarned = game.xpReward;
  const co2Saved = game.co2SavedPerPlay;

  user.rfxBalance += rfxEarned;
  user.xp += xpEarned;
  user.co2Saved += co2Saved;

  // In a real application, you might have more complex logic for leveling up
  // For now, let's assume level is derived from XP or updated elsewhere.

  await user.save();

  // Record transaction
  await Transaction.create({
    user: user._id,
    type: 'earning',
    amount: rfxEarned,
    currency: 'RFX',
    description: `Earned from playing ${game.name}`,
    relatedEntity: game._id,
    onModel: 'Game',
  });

  res.json({
    message: 'Game play recorded.',
    rfxEarned,
    xpEarned,
    co2Saved,
    newRfxBalance: user.rfxBalance,
    newXp: user.xp,
    newCo2Saved: user.co2Saved,
  });
});

module.exports = {
  getGames,
  recordGamePlay,
};
