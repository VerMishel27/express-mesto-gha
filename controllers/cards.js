const { NotFoundError } = require('../middlewares/notFoundError');
const { BadRequest } = require('../middlewares/badRequest');

const Card = require('../models/Card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    return res.status(200).send(cards);
  } catch (error) {
    return next(error);
  }
};

const postCard = async (req, res, next) => {
  try {
    const newCard = await new Card(req.body);
    newCard.owner = req.user._id;

    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequest('Переданы некорректные данные при создании карточки.'));
    }
    return next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }

    if (_id !== card.owner) {
      throw new BadRequest('Можно удалять только свою карточку!');
    }

    const delCard = await Card.findByIdAndRemove(req.params.cardId);
    return res.status(200).send(delCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequest('Передан неправильный _id.'));
    }
    return next(error);
  }
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }

      return res.status(201).send(like);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Передан некорректный _id карточки.'));
      }
      return next(error);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }

      return res.status(200).send(like);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Передан некорректный _id карточки.'));
      }
      return next(error);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
