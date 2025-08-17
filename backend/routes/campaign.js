const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  participateInCampaign,
  recordCampaignAction,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/:id/participate', protect, participateInCampaign);
router.post('/:id/record-action', protect, recordCampaignAction);

module.exports = router;
