const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { getWallet, getReferrals, getNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/userFeaturesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).patch(protect, updateUserProfile);
router.get('/wallet', protect, getWallet);
router.get('/referrals', protect, getReferrals);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);
router.patch('/notifications/mark-all-read', protect, markAllNotificationsRead);

module.exports = router;