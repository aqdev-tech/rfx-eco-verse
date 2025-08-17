const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'earning', 'purchase', 'withdrawal', 'bonus', 'referral_bonus'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['RFX', 'USD'],
    default: 'RFX',
  },
  description: {
    type: String,
  },
  relatedEntity: { // e.g., campaign ID, game ID, NFT ID
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    enum: ['Campaign', 'Game', 'NFT'], // Models that can be related to a transaction
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
