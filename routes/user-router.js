const express = require("express");
const userModel = require("../models/user-model.js");
const productModel = require("../models/product-model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const router = express.Router();
const { userRegister, userLogin } = require("../controller/auth.js");
const { addToCart, getCart, deleteCartItem } = require("../controller/cart.js");
const { payment } = require("../controller/stripe.js");

router.post("/login", userLogin);

router.post("/register", userRegister);

router.post("/cart", isLoggedIn, addToCart);

router.get("/cart", isLoggedIn, getCart);

router.delete("/cart/:product_id", isLoggedIn, deleteCartItem);

router.post("/create-payment", isLoggedIn, payment);

module.exports = router;
