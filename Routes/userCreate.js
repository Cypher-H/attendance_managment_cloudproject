require('dotenv').config()

const express = require('express')
const bycryptjs = require('bcryptjs')
const authtokens = require('../authTokens')
const UserModel = require('../Models/UserModel')
const verifyToken = require('../verifyToken')
var nodemailer = require('nodemailer');
const TeacherModel = require('../Models/TeacherModel')
const StudentModel = require('../Models/StudentModel')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


const app = express.Router()


app.post('/createTeacher', verifyToken, (req, res, next)=>{
    UserModel.findById(authtokens[req.headers['x-access-token']])
    .then((user)=>{
        if (user.role === 'admin') {
            // create teacher profile
            const { username, password,  email, number} = req.body
            if (username !== null && password !== null && email !== null && number !== null ){
                bycryptjs.hash(password, 8)
                .then((hashedPassword)=>{
                    UserModel.create({
                        username: username,
                        password: hashedPassword,
                        role: 'teacher'
                    })
                    .then((doc)=>{
                        TeacherModel.create({
                            name: username,
                            number: number,
                            email: email,
                            userId: doc._id
                        })
                        .then((doc2)=>{

                            var mailOptions = {
                                from: 'bibek.high@gmail.com',
                                to: email,
                                subject: 'User Account Created',
                                text: `Your account on student portal platform is successfully created your
                                <strong>username : </strong> ${username}
                                <strong>password : </strong> ${password}

                                Please set a new password
                                `
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              });

                            res.json({
                                message: 'Teacher user created successfully'
                            })
  
                        })
                    })
                })
            }
            else {
                res.json({
                    message: 'Fill the details properly'
                })
            }
    
        }
        else {
            res.status(401).json({
                message: 'Cannot Perform This Operation// Invalid Role'
            })
        }
    })
})

app.post('/createStudent', verifyToken, (req, res, next)=>{
    UserModel.findById(authtokens[req.headers['x-access-token']])
    .then((user)=>{
        if (user.role === 'admin' || user.role === 'teacher') {
            // create teacher profile
            const { username, password,  email, number, idnumber} = req.body
            if (username !== null && password !== null && email !== null && number !== null ){
                bycryptjs.hash(password, 8)
                .then((hashedPassword)=>{
                    UserModel.create({
                        username: username,
                        password: hashedPassword,
                        role: 'student'
                    })
                    .then((doc)=>{
                        StudentModel.create({
                            name: username,
                            number: number,
                            email: email,
                            idnumber: idnumber,
                            userId: doc._id
                        })
                        .then((doc2)=>{

                            var mailOptions = {
                                from: 'bibek.high@gmail.com',
                                to: email,
                                subject: 'User Account Created',
                                text: `Your account on student portal platform is successfully created your
                                <strong>username : </strong> ${username}
                                <strong>password : </strong> ${password}

                                Please set a new password
                                `
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              });

                            res.json({
                                message: 'Student user created successfully'
                            })
  
                        })
                    })
                })
            }
            else {
                res.json({
                    message: 'Fill the details properly'
                })
            }
    
        }
        else {
            res.status(401).json({
                message: 'Cannot Perform This Operation// Invalid Role'
            })
        }
    })
})



module.exports = app