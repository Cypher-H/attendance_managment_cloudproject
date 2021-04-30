require("dotenv").config();

const express = require("express");
const verifyToken = require("../verifyToken");
const bycryptjs = require("bcryptjs");
const authtokens = require("../authTokens");
const UserModel = require("../Models/UserModel");
var nodemailer = require("nodemailer");
const TeacherModel = require("../Models/TeacherModel");
const StudentModel = require("../Models/StudentModel");
const isEmailValid = require("../ReqFunctions/isEmailValid");

const multer = require('multer')
var multerS3 = require('multer-s3')
const isAdmin = require('../ReqFunctions/userType')


const AWS = require('aws-sdk');
const RoutineModel = require("../Models/routine");

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const multerConf = {
  storage : multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, file.originalname)
      }
  }),
  fileFilter : function(req, file, next){
      if (!file){
          next();
      }
      const image = file.mimetype.startsWith('image/');
      if (image){
          //uploadFile(file)
          next(null, true)
      }else{
          next({message: "File type not supported"}, false);
      }
  },
}

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
    const {
      name,
      number,
      email
    } = req.body;

    isEmailValid(email).then(({
      wellFormed,
      validDomain,
      validMailbox
    }) => {
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
                    message: "Teacher user created successfully and email has been sent to the student",
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
    const {
      name,
      number,
      email,
      id,
      rfid
    } = req.body;

    isEmailValid(email).then(({
      wellFormed,
      validDomain,
      validMailbox
    }) => {
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
                  rfid: rfid,
                  userId: doc._id,
                }).then((doc2) => {
                  res.json({
                    message: "Student user created successfully and email has been sent to the student",
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

app.get('/profile', (req, res, next)=>{
  const user = authtokens[req.headers['x-access-token']]
  console.log(user)
  if (user.type === 'admin') {
    UserModel.findById(user.id)
    .then((doc)=>{
      res.json({message: "success", username: doc.username, roll_no: "", email: '', phone_no: "", subjects: [], url: ''})
    })
    .catch((err)=>{
      res.json({message: "User not found// try restarting",})
    })
  } 
  else if (user.type === 'teacher') {
    TeacherModel.findOne({userId: user.id})
    .then((doc)=>{
      res.json({message: "success", username: doc.name, roll_no: "", email: doc.email, phone_no: doc.number, subjects: doc.Subjects, url: ''})
    })
    .catch((err)=>{
      res.json({message: "User not found// try restarting",})
    })
  } 
  else if (user.type === 'student') {
    StudentModel.findOne({userId: user.id})
    .then((doc)=>{
      res.json({message: "success", username: doc.name, roll_no: doc.idnumber, email: doc.email, phone_no: doc.number, subjects: doc.Subjects, url: doc.url})
    })
    .catch((err)=>{
      res.json({message: "User not found// try restarting",})
    })
  } 
})

app.post('/setprofile', verifyToken, multer(multerConf).single('file'), (req, res, next)=>{
  const user = authtokens[req.headers['x-access-token']]
  console.log(req)
  StudentModel.findOneAndUpdate({userId: user.id}, {
    url: req.file.location
  })
  .then((doc)=>{
    res.json({message: 'Profile Picture Updated Successfully'})
  })
  .catch((err)=>{
    res.json({message: 'Something went wrong'})
  })

})

module.exports = app;