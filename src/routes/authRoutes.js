const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/register', auth.registerPage);
router.post('/register', auth.register);
router.post('/register/confirm-2fa', auth.confirm2FA);

router.get('/login', auth.loginPage);
router.post('/login', auth.login);

router.get('/verify-2fa', auth.verify2FAPage);
router.post('/verify-2fa', auth.verify2FA);

router.get('/logout', auth.logout);

module.exports = router;
