const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: {
        value: true,
        message: "Поле name является обязательным",
      },
      minlength: [2, "Минимальная длинна 2 символа"],
      maxlength: [30, "Максимальная длинна 30 символов"],
    },
    about: {
      type: String,
      require: {
        value: true,
        message: "Поле name является обязательным",
      },
      minlength: [2, "Минимальная длинна 2 символа"],
      maxlength: [30, "Максимальная длинна 30 символов"],
    },
    avatar: {
      type: String,
      require: {
        value: true,
        message: "Поле name является обязательным",
      },
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
