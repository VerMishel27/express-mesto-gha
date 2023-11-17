const { Router } = require('express');

const {
  getUsers,
  getUserById,
  updateInfoUser,
  updateAvatarUser,
  getUsersMe,
} = require('../controllers/users');

const {
  avatarValidator,
  usersValidator,
} = require('../middlewares/customValidator');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUsersMe);
userRouter.get('/:userId', usersValidator, getUserById);
userRouter.patch('/me', updateInfoUser);
userRouter.patch('/me/avatar', avatarValidator, updateAvatarUser);

module.exports = userRouter;
