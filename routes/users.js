const { Router } = require("express");
const { getUsers, getUserById, createUser, updateInfoUser, updateAvatarUser } = require('../controllers/users')

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById)
userRouter.post('/', createUser)
userRouter.patch('/me', updateInfoUser)
userRouter.patch('/me/avatar', updateAvatarUser)

module.exports = userRouter;