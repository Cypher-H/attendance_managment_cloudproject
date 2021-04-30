const express = require("express");
const verifyToken = require("../verifyToken");
const Students = require("../Models/StudentModel");
const Teachers = require("../Models/TeacherModel");
const authtokens = require("../authTokens");
const AttendanceModel = require("../Models/AttendanceModel");
const mongoose = require("mongoose");
const StudentModel = require("../Models/StudentModel");


const app = express.Router();

app.get('/attendance', verifyToken,(req, res, next)=>{
    const user = authtokens[req.headers["x-access-token"]];
    if (user.type === "admin" || user.type === "teacher") {
        //Send all attendance
        AttendanceModel.find()
        .populate('Student')
        .then((docs)=>{
            res.json({message: "Success", attendance: docs})
        })
        .catch((err)=>{
            res.json({message: "Something went wrong",})
        })

    }
    else {
        // Send attendance of his subject
        console.log(user.id)
        StudentModel.findOne({userId: user.id})
        .then((stud)=>{
            console.log(stud)
            AttendanceModel.find({Student: stud._id}, (err, docs)=>{
                res.json({message: "Success", attendance: docs})
            })
        })
        .catch((err)=>{
            res.json({message: "No student found with that id"})
        })
        
        
    }
})


app.post('/markAttendance', (req, res, next)=>{
    const { date, day, time, uid} = req.body
    Students.findOne({rfid: uid})
    .then((doc)=>{
        console.log(doc)
        AttendanceModel.findOne({date: date, Student: doc._id})
        .then((val)=>{
            if (val === null) {
                AttendanceModel.create({
                    date: date,
                    day: day,
                    time: time,
                    Student: doc._id
                })
                .then((val1)=>{
                    console.log(val1)
                    res.json({message: 'Message sent successfully'})
                })
                .catch((err)=>{
                    console.log(err)
                    res.json({message: "Something went wrong"})
                })
            }
            else {
                res.json({message: "Failed to set attendance twice"})
            }
        })
    .catch((err)=>{
        console.log(err)
    })
        
    })
    .catch((err)=>{
        res.json({message: "No student registered with this rfid"})
    })
})

app.get('/uniqueAttendance', verifyToken,(req, res)=> { 
    AttendanceModel.find().distinct('date')
    .then((val)=>{
        console.log(val)
        res.json({message: "Success", days: val})
    })
    .catch((err)=>{
        console.log(err)
        res.json({message: "Something went wrong"})
    })
})

module.exports = app