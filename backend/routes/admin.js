const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  getDashboardSummary,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Dashboard
router.route('/dashboard-summary')
  .get(protect, authorizeRoles('admin', 'super_admin'), getDashboardSummary);

// User Management
router.route('/users')
  .get(protect, authorizeRoles('admin', 'super_admin'), getUsers);
router.route('/users/:id')
  .get(protect, authorizeRoles('admin', 'super_admin'), getUserById)
  .patch(protect, authorizeRoles('admin', 'super_admin'), updateUser)
  .delete(protect, authorizeRoles('admin', 'super_admin'), deleteUser);

// Campaign Management
router.route('/campaigns')
  .get(protect, authorizeRoles('admin', 'super_admin'), getAdminCampaigns)
  .post(protect, authorizeRoles('admin', 'super_admin'), createCampaign);
router.route('/campaigns/:id')
  .patch(protect, authorizeRoles('admin', 'super_admin'), updateCampaign)
  .delete(protect, authorizeRoles('admin', 'super_admin'), deleteCampaign);

// Submission Management
router.route('/submissions/pending')
  .get(protect, authorizeRoles('admin', 'super_admin'), getPendingSubmissions);
router.route('/submissions/:id/approve')
  .post(protect, authorizeRoles('admin', 'super_admin'), approveSubmission);
router.route('/submissions/:id/reject')
  .post(protect, authorizeRoles('admin', 'super_admin'), rejectSubmission);

module.exports = router;
