const express = require("express");
const verifyToken = require("../verifyToken");
// const Subjects = require("../Models/SubjectModel")
const Students = require("../Models/StudentModel");
const authtokens = require("../authTokens");


const app = express.Router();

app.get('/students', verifyToken, (req, res, next) => {
    const user = authtokens[req.headers["x-access-token"]];
    if (user.type === "admin") {
        Students.find((docs) => {
            //console.log(docs)
            res.json({
                message: 'Success',
                students: docs
            })
        })
    }
    else if (user.type === "teacher") {
        const { subjectId } = req.body
        Students.find( {Subjects: [subjectId]} ,(err , docs) => {
            //console.log(docs)
            res.json({
                message: 'Success',
                students: docs
            })
        })
    }
    else {
        res.status(401).json({
            message: "Cannot Perform This Operation// Invalid Role",
        });
    }
})

app.post('/allotSub', verifyToken, (req, res, next) => {
    const {} = req.body
})

module.exports = app