const db = require('../config/database');

const User = {
  create(name, email, hashedPassword, role, totpSecret) {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, role, totp_secret) VALUES (?, ?, ?, ?, ?)'
    );
    return stmt.run(name, email, hashedPassword, role, totpSecret);
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  enableTotp(userId) {
    db.prepare('UPDATE users SET totp_enabled = 1 WHERE id = ?').run(userId);
  },

  getAll() {
    return db.prepare('SELECT id, name, email, role, totp_enabled, created_at FROM users').all();
  },
};

module.exports = User;
