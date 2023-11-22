const Card = require('../models/Card');
const { FoundError } = require('../middlewares/foundError');

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
      return next(new FoundError('Переданы некорректные данные при создании карточки.', 400));
    }
    return next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new FoundError('Карточка с указанным _id не найдена.', 404));
    }

    if (_id !== String(card.owner)) {
      return next(new FoundError('Можно удалять только свою карточку!', 403));
    }

    const delCard = await Card.deleteOne(card);
    return res.status(200).send(delCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new FoundError('Передан неправильный _id.', 400));
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
        throw new FoundError('Передан несуществующий _id карточки.', 404);
      }

      return res.status(200).send(like);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new FoundError('Передан некорректный _id карточки.', 400));
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
        throw new FoundError('Передан несуществующий _id карточки.', 404);
      }

      return res.status(200).send(like);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new FoundError('Передан некорректный _id карточки.', 400));
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
