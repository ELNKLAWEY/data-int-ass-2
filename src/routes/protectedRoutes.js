const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const dash = require('../controllers/dashboardController');

router.get('/dashboard', verifyToken, dash.dashboard);
router.get('/profile', verifyToken, requireRole('user', 'admin', 'manager'), dash.profile);

router.get('/admin', verifyToken, requireRole('admin'), dash.adminPage);
router.get('/manager', verifyToken, requireRole('manager', 'admin'), dash.managerPage);
router.get('/user', verifyToken, requireRole('user'), dash.userPage);

module.exports = router;
