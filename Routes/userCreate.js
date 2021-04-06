require("dotenv").config();

const express = require("express");
const bycryptjs = require("bcryptjs");
const authtokens = require("../authTokens");
const UserModel = require("../Models/UserModel");
const verifyToken = require("../verifyToken");
var nodemailer = require("nodemailer");
const TeacherModel = require("../Models/TeacherModel");
const StudentModel = require("../Models/StudentModel");
const isEmailValid = require("../ReqFunctions/isEmailValid");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const app = express.Router();

app.post("/createTeacher", verifyToken, (req, res, next) => {
  const user = authtokens[req.headers["x-access-token"]];
  if (user.type === "admin") {
    // create teacher profile
    const { name, number, email } = req.body;

    isEmailValid(email).then(({ wellFormed, validDomain, validMailbox }) => {
      console.log(wellFormed, validDomain, validMailbox);
      if (
        name !== null &&
        email !== null &&
        number !== null &&
        wellFormed &&
        validDomain &&
        validMailbox === null
      ) {
        var mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "User Account Created",
          text: `Your account on student portal platform is successfully created your

                            username : ${name}
                            password : ${number}

                  Please set a new password as soon as possible. Thank You
                  `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          console.log(info);
          if (error) {
            res.json({
              message: "Please Provide a valid email id",
              success: false,
            });
          } else {
            bycryptjs.hash(number, 8).then((hashedPassword) => {
              UserModel.create({
                username: name,
                password: hashedPassword,
                role: "teacher",
              }).then((doc) => {
                TeacherModel.create({
                  name: name,
                  number: number,
                  email: email,
                  userId: doc._id,
                }).then((doc2) => {
                  res.json({
                    message:
                      "Teacher user created successfully and email has been sent to the student",
                    success: true,
                  });
                });
              });
            });
          }
        });
      } else {
        if (wellFormed && validDomain && validMailbox) {
          res.json({
            message: "Fill the details properly",
            success: false,
          });
        } else {
          res.json({
            message: `Email you provided is invalid please fill it again// Reason : ${
              wellFormed
                ? validDomain
                  ? "Invlid mailbox"
                  : "Invalid Domain"
                : "Improper Email"
            }`,
            success: false,
          });
        }
      }
    });
  } else {
    res.status(401).json({
      message: "Cannot Perform This Operation// Invalid Role",
    });
  }
});

app.post("/createStudent", verifyToken, (req, res, next) => {
  const user = authtokens[req.headers["x-access-token"]];
  console.log(user);
  if (user.type === "admin" || user.type === "teacher") {
    // create student profile
    const { name, number, email, id } = req.body;

    isEmailValid(email).then(({ wellFormed, validDomain, validMailbox }) => {
      console.log(wellFormed, validDomain, validMailbox);
      if (
        name !== null &&
        id !== null &&
        email !== null &&
        number !== null &&
        wellFormed &&
        validDomain &&
        validMailbox === null
      ) {
        var mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "User Account Created",
          text: `Your account on student portal platform is successfully created your
  
                              username : ${id}
                              password : ${number}
  
                              Please set a new password as soon as possible. Thank You
                              `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          console.log(info);
          if (error) {
            res.json({
              message: "Please Provide a valid email id",
              success: false,
            });
          } else {
            bycryptjs.hash(number, 8).then((hashedPassword) => {
              UserModel.create({
                username: id,
                password: hashedPassword,
                role: "student",
              }).then((doc) => {
                StudentModel.create({
                  name: name,
                  number: number,
                  email: email,
                  idnumber: id,
                  userId: doc._id,
                }).then((doc2) => {
                  res.json({
                    message:
                      "Student user created successfully and email has been sent to the student",
                    success: true,
                  });
                });
              });
            });
          }
        });
      } else {
        if (wellFormed && validDomain && validMailbox) {
          res.json({
            message: "Fill the details properly",
            success: false,
          });
        } else {
          res.json({
            message: `Email you provided is invalid please fill it again// Reason : ${
              wellFormed
                ? validDomain
                  ? "Invlid mailbox"
                  : "Invalid Domain"
                : "Improper Email"
            }`,
            success: false,
          });
        }
      }
    });
  } else {
    res.status(401).json({
      message: "Cannot Perform This Operation// Invalid Role",
      success: false,
    });
  }
});

module.exports = app;
