const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, 'dev_secret', { expiresIn: '7d' });
};

module.exports = {
  generateToken,
};
