const express = require("express");
const userModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports.userLogin = async function (req, res) {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send("User didnt exist");
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          {
            name: user.username,
            email: user.email,
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET
        );
        res.cookie("token", token);
        res.status(201).json({
          message: "login sucess",
        });
      } else {
        return res.status(404).send("User or password not match");
      }
    });
  } catch (err) {
    res.status(501).send("Error occured");
  }
};

module.exports.userRegister = async function (req, res) {
  const { username, email, password, contact, role } = req.body;
  try {
    let cuser = await userModel.findOne({ email: email });
    if (cuser) {
      return res.status(401).send("User alreay exist");
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const user = await userModel.create({
          username,
          email,
          password: hash,
          contact,
          role,
        });

        const token = jwt.sign(
          { email: user.email, user_id: user._id, contact: user.contact },
          process.env.JWT_SECRET
        );
        res.cookie("token", token);
        res.status(201).json({ message: "registed" });
      });
    });
  } catch (err) {
    res.status(501).send({ message: "error while registering" });
  }
};
