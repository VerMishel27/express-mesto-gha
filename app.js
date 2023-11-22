const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');

const app = express();

const { FoundError } = require('./middlewares/foundError');
const { errorHandler } = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);

app.use(errors());

app.use(() => {
  throw new FoundError('Страница не найдена', 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
