const jwt = require('jsonwebtoken');
const { FoundError } = require('./foundError');

const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new FoundError('Не правильные email или пароль!', 401);
    }

    const validTocken = token.replace('Bearer ', '');
    payload = jwt.verify(validTocken, 'dev_secret');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new FoundError('С токеном что-то не так!', 401));
    }
    next(error);
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
