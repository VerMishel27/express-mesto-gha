const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: {
        value: true,
        message: 'Поле name является обязательным',
      },
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, 'Максимальная длинна 30 символов'],
    },
    link: {
      type: String,
      required: {
        value: true,
        message: 'Поле link является обязательным',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: {},
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('card', cardSchema);
