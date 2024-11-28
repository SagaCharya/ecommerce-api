const express = require("express");
const db = require("./config/db");
const userRouter = require("./routes/user-router.js");
const productRouter = require("./routes/product-router.js");
const isLoggedIn = require("./middleware/isLoggedIn.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/product", isLoggedIn, productRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
