const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Null if in marketplace, otherwise owned by a user
  },
  price: {
    type: Number,
    required: function() { return this.owner === null; }, // Required if in marketplace
  },
  currency: {
    type: String,
    enum: ['RFX', 'USD'], // Or other currencies
    default: 'RFX',
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'minted'], // available for marketplace, sold for owned, minted for initial creation
    default: 'minted',
  },
  acquiredAt: {
    type: Date,
    default: null,
  },
  // Add other relevant fields like rarity, collection, etc.
}, { timestamps: true });

module.exports = mongoose.model('NFT', NFTSchema);
