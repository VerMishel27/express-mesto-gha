const Card = require("../models/Card");
const { BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  SUCCESS_STATUS} = require("../constants/errorStatus")

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
    return res.status(SERVER_ERROR_STATUS).send({ message: "Ошибка на стороне сервера" });
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
    return res.status(SERVER_ERROR_STATUS).send({ message: "Ошибка на стороне сервера" });
  }
};

const deleteCard = async (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      //console.log(card.owner);
      //console.log(req.user._id);
      if (!card) {
        throw new Error("NotFound");
      }
      // if (card.owner === req.user._id) {
      //   res.send(card)
      // }else {
      //   return res.status(404).send({message: "Удалить можно только свою карточку!"})
      // }
      return res.status(SUCCESS_STATUS).send(card);
    })
    .catch((error) => {
      //console.log(error);
      if (error.message === "NotFound") {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: "Ошибка на стороне сервера" });
    });
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((like) => {
      if (!req.params.cardId) {
        //console.log(req.params.cardId);
        throw new Error("NotFound");
      }
      if (!like) {
        throw new Error("NotFoundDataLike");
      }
      return res.status(CREATED_STATUS).send(like);
    })
    .catch((error) => {
      if (error.message === "NotFoundDataLike") {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({
            message:
              "Переданы некорректные данные для постановки/снятии лайка.",
          });
      }
      if (error.message === "NotFound") {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: "Передан несуществующий _id карточки." });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: "Ошибка на стороне сервера" });
    });

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((like) => {
      if (!req.params.cardId) {
        //console.log(req.params.cardId);
        throw new Error("NotFound");
      }
      if (!like) {
        throw new Error("NotFoundDataLike");
      }
      return res.status(SUCCESS_STATUS).send(like);
    })
    .catch((error) => {
      if (error.message === "NotFoundDataLike") {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({
            message:
              "Переданы некорректные данные для постановки/снятии лайка.",
          });
      }
      if (error.message === "NotFound") {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: "Передан несуществующий _id карточки." });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: "Ошибка на стороне сервера" });
    });

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
