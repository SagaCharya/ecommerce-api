const express = require("express");
const userModel = require("../models/user-model.js");
const productModel = require("../models/product-model.js");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("../middleware/isLoggedIn.js");

module.exports.addToCart = async function (req, res) {
  try {
    const { product_id } = req.body;
    if (req.user.role == "admin") {
      return res.status(401).json({ message: "Admin cannot add to cart" });
    }
    if (!product_id) {
      return res.status(401).json({ message: "Product id is needed" });
    }
    const product = await productModel.findOne({ _id: product_id });
    if (!product) {
      return res.status(401).json({ message: "Product didnt exist" });
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.product.includes(product_id)) {
      user.product.push(product_id);
      user.save();
    }

    res.status(200).json({ message: "Product added to cart", user });
  } catch (e) {
    return res.status(501).json({ message: e.message });
  }
};

module.exports.getCart = async function (req, res) {
  const user = await userModel.findOne({ _id: req.user.id });
  if (!user) {
    res.status(401).json({ message: "user not found" });
  }

  const product = await user.populate("product");

  res.status(201).json({ message: "cart product", Cart: product.product });
};

module.exports.deleteCartItem = async function (req, res) {
  const { product_id } = req.params;
  if (!product_id) {
    return res.status(401).json({ message: "product_id not found" });
  }
  const user = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { product: product_id } },
    { new: true }
  );
  if (!user) {
    return res.status(401).json({ message: "user or product invalid" });
  }
  const product = await user.populate("product");
  res
    .status(201)
    .json({ message: "cart product", UpdateCart: product.product });

  if (!user) {
    res.status(401).json({ message: "user not found" });
  }
};
