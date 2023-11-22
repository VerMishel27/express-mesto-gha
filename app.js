const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');

const app = express();

const { loginUser, createUser } = require('./controllers/users');
const { authenticateValidator, createValidator } = require('./middlewares/customValidator');
const { FoundError } = require('./middlewares/foundError');

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);

app.post('/signin', authenticateValidator, loginUser);
app.post('/signup', createValidator, createUser);

app.use(errors());

app.use(() => {
  throw new FoundError('Страница не найдена', 404);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
