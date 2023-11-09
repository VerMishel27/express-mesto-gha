//import User from "../models/User";
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    return res.send(user);
  } catch (error) {
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error("NotFound"));
    // if (!user) { throw new Error('NotFound')}
    return res.send(user);
  } catch (error) {
    if (error.message === "NotFound") {
      return res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден." });
    }
    if (error.name === "CastError") {
      return res.status(400).send({ message: "передан не валидный id" });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);

    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};

const updateInfoUser = async (req, res) => {
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
        throw new Error("NotFound");
      }
      res.send({ name: user.name, about: user.about });
    })
    .catch((error) => {
      if (error.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res.status(500).send({ message: "Ошибка на стороне сервера" });
    });
};

const updateAvatarUser = async (req, res) => {
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
        throw new Error("NotFound");
      }
      res.send({ avatar: user.avatar });
    })
    .catch((error) => {
      if (error.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res.status(500).send({ message: "Ошибка на стороне сервера" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateInfoUser,
  updateAvatarUser,
};
