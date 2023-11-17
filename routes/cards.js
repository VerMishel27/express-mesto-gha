const { Router } = require('express');

const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { postCardValidator, cardIdValidator } = require('../middlewares/customValidator');

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', postCardValidator, postCard);
cardRouter.delete('/:cardId', cardIdValidator, deleteCard);
cardRouter.put('/:cardId/likes', cardIdValidator, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = cardRouter;
