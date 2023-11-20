const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');

const app = express();

const { loginUser, createUser } = require('./controllers/users');
const { authenticateValidator, createValidator } = require('./middlewares/customValidator');

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

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
});

app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
