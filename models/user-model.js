const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
  },
  password: {
    type: String,
    require: true,
    min: 5,
  },
  email: {
    type: String,
    require: true,
    min: 9,
  },
  contact: {
    type: Number,
    require: true,
    min: 10,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("user", userSchema);
