const express = require('express');
const router = express.Router();
const {
  getPlatformSettings,
  updatePlatformSettings,
  getAdmins,
  addAdmin,
  updateAdmin,
  removeAdmin,
  getAdminById, // Added getAdminById
  getDashboardSummary,
} = require('../controllers/superAdminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Dashboard
router.route('/dashboard-summary')
  .get(protect, authorizeRoles('super_admin'), getDashboardSummary);

// Platform Settings
router.route('/settings')
  .get(protect, authorizeRoles('super_admin'), getPlatformSettings)
  .patch(protect, authorizeRoles('super_admin'), updatePlatformSettings);

// Admin Management
router.route('/admins')
  .get(protect, authorizeRoles('super_admin'), getAdmins)
  .post(protect, authorizeRoles('super_admin'), addAdmin);
router.route('/admins/:id')
  .get(protect, authorizeRoles('super_admin'), getAdminById) // Added GET route for single admin
  .patch(protect, authorizeRoles('super_admin'), updateAdmin)
  .delete(protect, authorizeRoles('super_admin'), removeAdmin);

module.exports = router;
