const bcrypt = require('bcrypt');
const User = require('../models/User');

const { generateToken } = require('../utils/jwt');

const { MONGO_DUPLCATE_ERROR_CODE } = require('../constants/errorStatus');
const { FoundError } = require('../middlewares/foundError');

const SOLT_ROUNDS = 10;

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    return res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => next(new FoundError('Пользователь с указанным _id не найден.', 404)));

    return res.status(200).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new FoundError('Передан не валидный id', 400));
    }
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;

    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    return res.status(201).send({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLCATE_ERROR_CODE) {
      return next(new FoundError('Пользователь с таким email уже существует!', 409));
    }
    if (error.name === 'ValidationError') {
      return next(new FoundError('Переданы некорректные данные при создании пользователя.', 400));
    }
    return next(error);
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
    },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь с указанным _id не найден.', 404);
      }
      return res.status(200).send({ name: user.name, about: user.about });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new FoundError('Переданы некорректные данные при обновлении профиля.', 400));
      }
      return next(error);
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
    },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь с указанным _id не найден.', 404);
      }
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new FoundError('Переданы некорректные данные при обновлении профиля.', 400));
      }
      return next(error);
    });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userAdmin = await User.findOne({ email })
      .select('+password')
      .orFail(() => next(new FoundError('Пользователь не найден!', 401)));

    const matched = await bcrypt.compare(String(password), userAdmin.password);

    if (!matched) {
      throw new FoundError('Не правильные email или пароль!', 401);
    }

    const token = generateToken({ _id: userAdmin._id, email: userAdmin.email }, 'dev_secret');

    return res.status(200).send({ token, email: userAdmin.email });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new FoundError('Переданы некорректные данные при создании пользователя.', 400));
    }
    return next(error);
  }
};

const getUsersMe = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      throw new FoundError('Пользователь с указанным _id не найден.', 404);
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
      return next(new FoundError('Передан не валидный id', 400));
    }
    return next(error);
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
