const jwt = require('jsonwebtoken');
const { NotAutanticate } = require('./handlingError');

const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new NotAutanticate('Не правильные email или пароль!');
    }

    const validTocken = token.replace('Bearer ', '');
    payload = jwt.verify(validTocken, 'dev_secret');

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new NotAutanticate('С токеном что-то не так!'));
    }
    next(error);
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
