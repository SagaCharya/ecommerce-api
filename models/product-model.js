const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("product", productSchema);
