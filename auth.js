const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bycryptjs = require("bcryptjs");
const User = require("./Models/UserModel");
const config = require("./config");
const verifyToken = require("./verifyToken");
const authtokens = require("./authTokens");
const UserModel = require("./Models/UserModel");

const app = express.Router();

app.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    bycryptjs.hash(password, 8).then((value) => {
      User.create({
        username: username,
        password: value,
        role: "admin",
      })
        .then((doc) => {
          const token = jsonwebtoken.sign({ id: doc._id }, config.secret, {
            expiresIn: 3600,
          });
          const decoded = jsonwebtoken.decode(token);
          authtokens[token] = {
            id: doc._id,
            type: doc.role,
          };
          res
            .status(200)
            .json({
              auth: true,
              token: token,
              status: "loggedIn",
              uid: doc._id,
              role: doc.role,
              exp: decoded.exp,
            });
        })
        .catch((er) => {
          res
            .status(200)
            .json({ auth: false, status: er.message, token: null });
        });
    });
  } else {
    res
      .status(500)
      .json({ auth: false, status: "Unable to find username or password" });
  }
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body)
  if (username && password) {
    User.findOne({ username: username }).then((doc) => {
      if (doc !== null) {
        const isValid = bycryptjs.compareSync(password, doc.password);
        if (isValid) {
          const token = jsonwebtoken.sign({ id: doc._id }, config.secret, {
            expiresIn: 3600, //86400
          });
          const decoded = jsonwebtoken.decode(token);
          authtokens[token] = {
            id: doc._id,
            type: doc.role,
          };
          res
            .status(200)
            .json({
              auth: true,
              token: token,
              status: "loggedIn",
              uid: doc._id,
              role: doc.role,
              exp: decoded.exp,
            });
        } else {
          res
            .status(200)
            .json({
              auth: false,
              token: null,
              status: "Incorrect Password",
              uid: doc._id,
            });
        }
      } else {
        res
          .status(200)
          .json({
            auth: false,
            token: null,
            status: "Incorrect Username Or Password",
            uid: null,
          });
      }
    });
  } else {
    res
      .status(500)
      .json({ auth: false, status: "Unable to find username or password" });
  }
});

app.post("/passwordchange", verifyToken, (req, res, next) => {
  const { userId, password, newPassword } = req.body;
  console.log(req.body);
  UserModel.findById(userId).then((doc) => {
    const isValid = bycryptjs.compareSync(password, doc.password);
    if (isValid) {
      bycryptjs.hash(newPassword, 8).then((hashedPass) => {
        UserModel.updateOne(
          { _id: doc._id },
          {
            username: doc.username,
            password: hashedPass,
            role: doc.role,
          }
        ).then(() => {
          res.status(200).json({ message: "Password Changed Successfully" });
        });
      });
    } else {
      res
        .status(200)
        .json({
          auth: false,
          token: null,
          status: "Incorrect Password",
          uid: doc._id,
        });
    }
  });
});

app.get("/logout", verifyToken, function (req, res) {
  delete authtokens[req.headers["x-access-token"]];
  res.status(200).send({ auth: false, token: null, status: "Logged-Out" });
});

module.exports = app;
