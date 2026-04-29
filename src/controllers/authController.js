const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/user');

async function registerPage(req, res) {
  res.render('register');
}

async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.render('register', { error: 'All fields are required.' });
  }

  const validRoles = ['admin', 'manager', 'user'];
  if (!validRoles.includes(role)) {
    return res.render('register', { error: 'Invalid role selected.' });
  }

  if (User.findByEmail(email)) {
    return res.render('register', { error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const secret = speakeasy.generateSecret({
    name: `SecureAuth (${email})`,
    length: 20,
  });

  User.create(name, email, hashedPassword, role, secret.base32);
  const newUser = User.findByEmail(email);

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  res.render('setup-2fa', { qrCodeUrl, secret: secret.base32, userId: newUser.id });
}

async function confirm2FA(req, res) {
  const { userId, token } = req.body;
  const user = User.findById(parseInt(userId));

  if (!user) {
    return res.render('error', { message: 'User not found.' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.totp_secret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!verified) {
    const qrCodeUrl = await qrcode.toDataURL(
      speakeasy.otpauthURL({ secret: user.totp_secret, label: `SecureAuth (${user.email})`, encoding: 'base32' })
    );
    return res.render('setup-2fa', {
      qrCodeUrl,
      secret: user.totp_secret,
      userId: user.id,
      error: 'Invalid code. Please try again.',
    });
  }

  User.enableTotp(user.id);
  res.render('register-success');
}

function loginPage(req, res) {
  res.render('login');
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    return res.render('login', { error: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.render('login', { error: 'Invalid email or password.' });
  }

  res.render('verify-2fa', { userId: user.id });
}

function verify2FAPage(req, res) {
  res.render('verify-2fa', { userId: req.query.userId });
}

function verify2FA(req, res) {
  const { userId, token } = req.body;
  const user = User.findById(parseInt(userId));

  if (!user) {
    return res.render('error', { message: 'User not found.' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.totp_secret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!verified) {
    return res.render('verify-2fa', { userId, error: 'Invalid 2FA code. Please try again.' });
  }

  const jwtToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
  res.redirect('/dashboard');
}

function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/login');
}

module.exports = { registerPage, register, confirm2FA, loginPage, login, verify2FAPage, verify2FA, logout };
