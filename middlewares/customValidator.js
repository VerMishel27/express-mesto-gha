const { celebrate, Joi } = require('celebrate');

const regex = /^(https?:\/\/)?([\da-zA-Z.\-?]+).([a-z.]{2,6})([/\w.-]*)*\/?$/;

const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(regex)),
  }),
});

const infoUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const usersValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const postCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(regex)),
  }),
});

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const authenticateValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regex)),
  }),
});

module.exports = {
  avatarValidator,
  usersValidator,
  postCardValidator,
  cardIdValidator,
  authenticateValidator,
  createValidator,
  infoUserValidator,
};
