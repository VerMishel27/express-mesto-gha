const bcrypt = require('bcrypt');
const User = require('../models/User');

const { generateToken } = require('../utils/jwt');
const {NotFoundError, BadRequest, NotAutanticate, MONGO_DUPLCATE_ERROR} = require('../middlewares/handlingError');

const {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  SUCCESS_STATUS,
} = require("../constants/errorStatus");

const { MONGO_DUPLCATE_ERROR_CODE } = require('../constants/errorStatus');

const SOLT_ROUNDS = 10;

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    return res.status(200).send(user);
  } catch (error) {
   next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error("NotFound"));

    return res.status(200).send(user);
  } catch (error) {
    if (error.message === "NotFound") {
      next(new NotFoundError('Пользователь с указанным _id не найден.'));
    }
    if (error.name === 'CastError') {
      next(new BadRequest('Передан не валидный id'));
    }
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.create({ email, password: hash });

    return res.status(201).send({
      email: newUser.email,
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLCATE_ERROR_CODE) {
      next(new MONGO_DUPLCATE_ERROR('Пользователь с таким email уже существует!'));
    }
    if (error.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
    }
    next(error);
  }
};

const updateInfoUser = async (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.status(200).send({ name: user.name, about: user.about });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      next(error);
    });
};

const updateAvatarUser = async (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      next(error);
    });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userAdmin = await User.findOne({ email })
      .select("+password")
      .orFail((err) => new Error('NotFound'));

    const matched = await bcrypt.compare(String(password), userAdmin.password);

    if (!matched) {
      throw new NotAutanticate('Не правильные email или пароль!');
    }

    const token = generateToken({ _id: userAdmin._id, email: userAdmin.email });

    //res.cookie('parrotToken', token, {maxAge: '7d', httpOnly: true, sameSite: true})

    return res.status(200).send({ token, email: userAdmin.email });
  } catch {
    if (error.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
    }
   next(error);
  }
};

const getUsersMe = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }

    const user = await User.findById(_id);

    return res
      .status(200)
      .send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequest('Передан не валидный id'));
    }
   next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateInfoUser,
  updateAvatarUser,
  loginUser,
  getUsersMe,
};
