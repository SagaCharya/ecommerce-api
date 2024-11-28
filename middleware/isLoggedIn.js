const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

async function isloggedIn(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userModel
      .findOne({ email: decoded.email })
      .select({ password: 0 });
    if (!user) {
      return res.status(401).json({ message: "user.notfound" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message: error.message });
  }
}

module.exports = isloggedIn;
