require("dotenv").config();

const express = require('express');
const authtokens = require('../authTokens');
const EnrollmentModel = require('../Models/EnrollmentModel');
const StudentModel = require('../Models/StudentModel');
const TeacherModel = require('../Models/TeacherModel');
const SubjectModel = require('../Models/SubjectModel')
const verifyToken = require('../verifyToken');
var nodemailer = require("nodemailer");

const app = express.Router();

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

app.get('/enrollment', verifyToken, (req, res, next)=>{


    const user = authtokens[req.headers['x-access-token']]
    if (user.type === 'admin') {
        EnrollmentModel.find()
        .then((docs)=>{
            res.json({message: 'Success', enrollment: docs})
        })
        .catch((err)=>{
            res.json({message: 'Something went wrong',})
        })
    }
    else if (user.type === 'teacher') {

        TeacherModel.findOne({userId: user.id})
        .then((doc)=>{
            EnrollmentModel.find({Subject: {"$in": doc.Subjects}})
            .populate('Student')
            .populate('Subject')
            .then((docs)=>{
                res.json({message: 'Success', enrollment: docs})
            })
            .catch((err)=>{
                res.json({message: 'Something went wrong',})
            })
        })
        
    }
    else {
        StudentModel.findOne({userId: user.id})
        .then((doc)=>{
            EnrollmentModel.find({Student: doc._id})
            .populate("")
            .then((docs)=>{
                res.json({message: 'Success', enrollment: docs})
            })
            .catch((err)=>{
                res.json({message: 'Something went wrong',})
            })
        })
    }
    
})

app.post("/enrollment", verifyToken, (req, res, next)=>{
    const user = authtokens[req.headers['x-access-token']]
    if (user.type === "student") {
        StudentModel.findOne({userId: user.id})
        .then((doc)=>{
            EnrollmentModel.find({Student: doc._id})
            .then((docs)=>{
                try {
                    docs.forEach((d)=>{
                        if (d.Subject == req.body.subjectId){
                            throw BreakException
                        }
                    })
                    if (docs.length + doc.Subjects.length < 5) {
                        EnrollmentModel.create({
                            verified: false,
                            Subject: req.body.subjectId,
                            Student: doc._id
                        })
                        .then((val)=>{
                            res.json({message: "Request added successfully"})
                        })
                    }
                    else {
                        res.json({message: "You have reached the maximum course request"})
                    }
                } catch (e) {
                    res.json({message: "You have already requested this subject"})
                }
            })
        })
    }
    else {
        res.json({message: "Forbidden operation"})
    }
})

app.post('/approveenroll', verifyToken, (req, res, next)=>{
    const user = authtokens[req.headers['x-access-token']]
    if (user.type === 'teacher') {
        EnrollmentModel.findByIdAndDelete(req.body.enrollId)
        .then((doc)=>{
            console.log(doc)
            SubjectModel.findByIdAndUpdate(doc.Subject, {$addToSet: {Students: doc.Student}})
            .then((doc1)=>{
                console.log(doc1)
                StudentModel.findByIdAndUpdate(doc.Student, {$addToSet: {Subjects: doc.Subject}})
                .then((doc2)=>{
                    console.log(doc2)
                    var mailOptions = {
                        from: process.env.EMAIL,
                        to: doc2.email,
                        subject: "Enrollment Approved",
                        text: ` Your Enrollment has been approved for subject ${doc1.Name}
                            `,
                      };
        
                      transporter.sendMail(mailOptions)
                      .then((v)=>{
                        console.log('Mail sent')
                    })
                })
            })

            res.json({message: "Approved Successful !!!"})
        })
    }
    else {
        res.json({message: "Forbidden operation"})
    }
})

app.post('/rejectenroll', verifyToken, (req, res, next)=>{
    const user = authtokens[req.headers['x-access-token']]
    if (user.type === 'teacher') {
        EnrollmentModel.findByIdAndDelete(req.body.enrollId)
        .then((doc)=>{
            SubjectModel.findById(doc.Subject)
            .then((doc1)=>{
                StudentModel.findOne({_id: doc.Student})
                .then((doc2)=>{
                    var mailOptions = {
                        from: process.env.EMAIL,
                        to: doc2.email,
                        subject: "Enrollment Rejected",
                        text: ` Your Enrollment has been Rejected for subject ${doc1.Name}
                            `,
                      };
        
                      transporter.sendMail(mailOptions)
                      .then((v)=>{
                          console.log('Mail sent')
                      })
                })
            })
            res.json({message: "Rejection Successful !!!"})
        })
    }
    else {
        res.json({message: "Forbidden operation"})
    }
})


module.exports = app