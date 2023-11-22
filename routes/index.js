const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const { authenticateValidator, createValidator } = require('../middlewares/customValidator');
const { createUser, loginUser } = require('../controllers/users');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.post('/signin', authenticateValidator, loginUser);
router.post('/signup', createValidator, createUser);

module.exports = router;
