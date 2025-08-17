const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['campaign_update', 'reward', 'referral', 'system', 'achievement'],
    default: 'system',
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: { // Optional link to relevant page
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
