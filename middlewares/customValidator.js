const { celebrate, Joi } = require('celebrate');

const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(regex)),
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
    link: Joi.string().pattern(new RegExp(regex))
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

module.exports = {
  avatarValidator,
  usersValidator,
  postCardValidator,
  cardIdValidator,
  authenticateValidator,
}
