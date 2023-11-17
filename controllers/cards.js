const { NotFoundError, BadRequest } = require('../middlewares/handlingError');

const Card = require('../models/Card');
const {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  SUCCESS_STATUS,
} = require('../constants/errorStatus');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    next(error);
  }
};

const postCard = async (req, res, next) => {
  try {
    const newCard = await new Card(req.body);
    newCard.owner = req.user._id;

    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании карточки.'));
    }
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const _id = req.user._id;
    const delCard = await Card.findByIdAndRemove(req.params.cardId);

    if (!delCard) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }

    if (_id === delCard.owner) {
      return res.status(200).send(delCard);
    } else {
      throw new BadRequest('Можно удалять только свою карточку!')
    }
  } catch (error) {
        if (error.name === 'CastError') {
          next(new BadRequest('Передан неправильный _id.'));
        }
    next(error);
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
        next(new BadRequest('Передан некорректный _id карточки.'));
      };
      next(error);
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
        next(new BadRequest('Передан некорректный _id карточки.'));
      };
      next(error);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
