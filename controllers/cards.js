const Card = require("../models/Card");
const {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  SUCCESS_STATUS,
} = require("../constants/errorStatus");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(SUCCESS_STATUS).send(cards);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST_STATUS).send({
        message: "Переданы некорректные данные.",
      });
    }
    return res
      .status(SERVER_ERROR_STATUS)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

const postCard = async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    newCard.owner = req.user._id;

    return res.status(CREATED_STATUS).send(await newCard.save());
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST_STATUS).send({
        message: " Переданы некорректные данные при создании карточки.",
      });
    }
    return res
      .status(SERVER_ERROR_STATUS)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

const deleteCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== 24) {
      throw new Error("NotFoundId");
    }

    const delCard = await Card.findByIdAndRemove(req.params.cardId);

    if (!delCard) {
      throw new Error("NotFound");
    }

    return res.status(SUCCESS_STATUS).send(delCard);
  } catch (error) {
    if (error.message === "NotFoundId") {
      return res
        .status(BAD_REQUEST_STATUS)
        .send({ message: "Передан неправильный _id." });
    }
    if (error.message === "NotFound") {
      return res
        .status(NOT_FOUND_STATUS)
        .send({ message: "Карточка с указанным _id не найдена." });
    }
    return res
      .status(SERVER_ERROR_STATUS)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

const likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
      .then((like) => {
        if (!like) {
          throw new Error("NotFound");
        }

        return res.status(CREATED_STATUS).send(like);
      })
      .catch((error) => {
        if (error.message === "NotFound") {
          return res
            .status(NOT_FOUND_STATUS)
            .send({ message: "Передан несуществующий _id карточки." });
        }

        return res
          .status(SERVER_ERROR_STATUS)
          .send({ message: "Ошибка на стороне сервера" });
      });
  } else {
    return res
      .status(BAD_REQUEST_STATUS)
      .send({ message: "Передан некорректный _id карточки." });
  }
};

const dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
      .then((like) => {
        if (!like) {
          throw new Error("NotFound");
        }

        return res.status(SUCCESS_STATUS).send(like);
      })
      .catch((error) => {
        if (error.message === "NotFound") {
          return res
            .status(NOT_FOUND_STATUS)
            .send({ message: "Передан несуществующий _id карточки." });
        }

        return res
          .status(SERVER_ERROR_STATUS)
          .send({ message: "Ошибка на стороне сервера" });
      });
  } else {
    return res
      .status(BAD_REQUEST_STATUS)
      .send({ message: "Передан некорректный _id карточки." });
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
