const User = require('../models/user');

function dashboard(req, res) {
  res.render('dashboard', { user: req.user });
}

function profile(req, res) {
  const user = User.findById(req.user.id);
  res.render('profile', { user });
}

function adminPage(req, res) {
  const users = User.getAll();
  res.render('admin', { user: req.user, users });
}

function managerPage(req, res) {
  res.render('manager', { user: req.user });
}

function userPage(req, res) {
  res.render('user-page', { user: req.user });
}

module.exports = { dashboard, profile, adminPage, managerPage, userPage };
