const mongoose = require("mongoose");
const express = require("express");
const upload = require("../config/multer.js");
const {
  showProduct,
  searchProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.js");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", showProduct);

router.get("/search", searchProduct);

router.post("/", upload.single("image"), insertProduct);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
