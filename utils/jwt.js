const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, 'dev_secret', { expiresIn: '7d' });

module.exports = {
  generateToken,
};
