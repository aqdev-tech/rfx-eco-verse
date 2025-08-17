const asyncHandler = require('express-async-handler');
const NFT = require('../models/NFT');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all NFTs (marketplace or user's collection)
// @route   GET /api/nfts
// @access  Public (for marketplace), Private (for user collection)
const getNfts = asyncHandler(async (req, res) => {
  const { type, userId } = req.query;
  let query = {};

  if (type === 'marketplace') {
    query.owner = null; // NFTs available for sale
    query.status = 'available';
  } else if (type === 'user_collection' && userId) {
    query.owner = userId; // Specific user's collection
  } else if (type === 'user_collection' && req.user) {
    query.owner = req.user.id; // Authenticated user's collection
  }

  const nfts = await NFT.find(query).populate('owner', 'username');
  res.json(nfts);
});

// @desc    Get single NFT details
// @route   GET /api/nfts/:id
// @access  Public
const getNftById = asyncHandler(async (req, res) => {
  const nft = await NFT.findById(req.params.id).populate('owner', 'username');

  if (nft) {
    res.json(nft);
  } else {
    res.status(404);
    throw new Error('NFT not found');
  }
});

// @desc    Purchase NFT with RFX
// @route   POST /api/nfts/:id/buy
// @access  Private
const buyNft = asyncHandler(async (req, res) => {
  const nftId = req.params.id;
  const user = await User.findById(req.user.id);
  const nft = await NFT.findById(nftId);

  if (!nft) {
    res.status(404);
    throw new Error('NFT not found');
  }

  if (nft.owner !== null) {
    res.status(400);
    throw new Error('NFT is not available for purchase');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.rfxBalance < nft.price) {
    res.status(400);
    throw new Error('Insufficient RFX balance');
  }

  // Deduct RFX from user
  user.rfxBalance -= nft.price;
  await user.save();

  // Assign NFT to user
  nft.owner = user._id;
  nft.status = 'sold';
  nft.acquiredAt = new Date();
  await nft.save();

  // Record transaction
  await Transaction.create({
    user: user._id,
    type: 'purchase',
    amount: nft.price,
    currency: 'RFX',
    description: `Purchased NFT: ${nft.name}`,
    relatedEntity: nft._id,
    onModel: 'NFT',
  });

  res.json({
    message: 'NFT purchased successfully.',
    nft: nft,
    newRfxBalance: user.rfxBalance,
  });
});

module.exports = {
  getNfts,
  getNftById,
  buyNft,
};
