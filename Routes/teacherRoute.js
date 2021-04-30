const express = require("express");
const verifyToken = require("../verifyToken");
// const Subjects = require("../Models/SubjectModel")
const Teachers = require("../Models/TeacherModel");
const authtokens = require("../authTokens");


const app = express.Router();

app.get('/teachers', verifyToken, (req, res, next) => {
    const user = authtokens[req.headers["x-access-token"]];
    if (user.type === "admin") {
        Teachers.find({} ,(err, docs) => {
            console.log(docs)
            res.json({
                message: 'Success',
                teachers: docs
            })
        })
    } else {
        res.status(401).json({
            message: "Cannot Perform This Operation// Invalid Role",
        });
    }
})

app.post('/allotSub', verifyToken, (req, res, next) => {
    const {} = req.body
})

module.exports = app