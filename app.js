const express = require("express");
//const Router = require('express')
const mongoose = require("mongoose");
//const path = require('path')
const router = require("./routes");
const app = express();
//import {router} from './routes';
//const _dirname = path.resolve();

const { PORT = 3000 } = process.env;
app.use((req, res, next) => {
  req.user = {
    _id: "654cb3791cb20f9fce3840a4", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

//app.use(express.static(path.join(_dirname, 'public')))
app.use(express.json());
//mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);

app.use((req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};
