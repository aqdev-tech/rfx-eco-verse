const express = require('express');
const router = express.Router();
const {
  getUserDashboardSummary,
  getAdminDashboardSummary,
  getSuperAdminDashboardSummary,
} = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/user/dashboard-summary', protect, getUserDashboardSummary);
router.get('/admin/dashboard-summary', protect, authorizeRoles('admin', 'super_admin'), getAdminDashboardSummary);
router.get('/super-admin/dashboard-summary', protect, authorizeRoles('super_admin'), getSuperAdminDashboardSummary);

module.exports = router;
