const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  type: {
    type: String,
    enum: ['photo', 'video', 'text', 'data'], // Type of submission
    required: true,
  },
  content: { // URL for photo/video, text for text submission, JSON for data
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
