const mongoose = require("mongoose");
const express = require("express");
const productModel = require("../models/product-model.js");
const userModel = require("../models/user-model.js");
const exp = require("constants");
const upload = require("../config/multer.js");

module.exports.showProduct = async function (req, rea) {
  try {
    const product = await productModel.find();
    res.status(201).json({ product: product });
  } catch (e) {
    res.status(501).json({ message: e.message });
  }
};

module.exports.searchProduct = async function (req, res) {
  const { name } = req.query;
  try {
    const searchQuery = {
      name: { $regex: `^${name}`, $options: "i" },
    };
    const products = await productModel.find(searchQuery);

    if (products.length === 0) {
      return res.status(404).json({ message: "NO product found" });
    }
    res.status(200).json({ message: "Products found", products });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports.insertProduct = async function (req, res) {
  if (req.user.role == "user") {
    return res.status(404).json({ message: "invlaid role" });
  }
  try {
    const imagePath = req.file ? "/uploads/" + req.file.filename : null;
    const { name, detail, price, discount } = req.body;
    if (!name || !detail || !price) {
      console.log("all field needed");
    }
    const newProduct = await productModel.create({
      name: name,
      detail: detail,
      image: imagePath,
      price: price,
      discount: discount,
    });
    res.status(200).json({ message: "Product uploaded", product: newProduct });
  } catch (e) {
    res.status(501).json({ message: e.message });
  }
};

module.exports.updateProduct = async function (req, res) {
  if (req.user.role == "user") {
    return res.status(404).json({ message: "invlaid role" });
  }
  try {
    const imagePath = req.file ? "/uploads/" + req.file.filename : null;
    const { name, detail, price, discount } = req.body;
    const { id } = req.params;
    if (!name || !detail || !price) {
      console.log("all field needed");
    }
    const updatedProduct = await productModel.findById(id);
    updatedProduct.name = name;
    updatedProduct.detail = detail;
    updatedProduct.price = price;
    updatedProduct.discount = discount;
    updatedProduct.image = imagePath;

    updatedProduct.save();

    res
      .status(200)
      .json({ message: "Product Updated", product: updatedProduct });
  } catch (e) {
    res.status(501).json({ message: e.message });
  }
};

module.exports.deleteProduct = async function (req, res) {
  try {
    const { id } = req.params;

    if (req.user.role == "user") {
      return res.status(401).json({ message: "invalid role" });
    }

    const product = await productModel.findOne({ _id: id });
    if (!product) {
      res.status(401).json({ message: "product didnt exist" });
    }
    const deletedProduct = await productModel.findOneAndDelete({ _id: id });

    res.status(201).json({ message: "product deleted sucessfully", product });
  } catch (e) {
    res.status(501).json({ message: e.message });
  }
};
