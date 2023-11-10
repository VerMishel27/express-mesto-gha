const express = require("express");

const mongoose = require("mongoose");

const router = require("./routes");
const app = express();
const {
  NOT_FOUND_STATUS,
} = require("./constants/errorStatus");

const { PORT = 3000 } = process.env;
app.use((req, res, next) => {
  req.user = {
    _id: "654cb3791cb20f9fce3840a4", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);

app.use((req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
