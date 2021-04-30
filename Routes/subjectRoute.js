require("dotenv").config();

const express = require("express");
const verifyToken = require("../verifyToken");
const Subjects = require("../Models/SubjectModel")
const TeacherModel = require("../Models/TeacherModel");
const authtokens = require("../authTokens");
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


const app = express.Router();

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

app.get('/subjects', verifyToken, (req, res, next) => {
    Subjects.find({}).populate('Teacher').then((docs) => {
        res.json({message: "Success", subjects: docs})
    })
})

app.post('/createSubject', verifyToken, (req, res, next) => {
    const user = authtokens[req.headers["x-access-token"]];
    if (user.type === "admin") {
        const {
            name,
            teacherID,
            credit
        } = req.body
        if (teacherID !== null && name !== null) {
            TeacherModel.findOne({_id: teacherID}, (err , docs) => {
                if (docs === null) {
                    res.json({
                        message: 'Teacher Not Found'
                    })
                } else {
                    Subjects.create({
                            Name: name,
                            Credit: credit,
                            Teacher: teacherID
                        })
                        .then((doc) => {
                            console.log(doc)
                            TeacherModel.updateOne({_id: teacherID}, {$addToSet: { Subjects : [doc._id]}})
                            .then((val)=>{
                                console.log(val)
                            })
                            res.json({
                                message: 'Subject created successfully'
                            })
                        })
                }
            })
        } else {
            res.json({
                message: 'Please Provide a teacher'
            })
        }
    } else {
        res.status(401).json({
            message: "Cannot Perform This Operation// Invalid Role",
        });
    }
})

app.get('/routine', verifyToken, (req, res, next)=>{
    RoutineModel.find()
    .then((doc)=>{
        if (doc.length == 0) {
            res.json({message: "no routine available"})
        }
        else{
            res.json({message: "Success" , url: doc[0].url})
        }
    })
    .catch((err)=>{
        res.json({message: " something went wrong"})
    })
})


app.post('/routine',  verifyToken, isAdmin ,multer(multerConf).single('file'), (req, res, next)=>{ 
       
    console.log(req.file.location)
    RoutineModel.find()
    .then((doc)=>{
        console.log(doc)
        if(doc.length == 0) {
            RoutineModel.create({
                url: req.file.location
            })
            .then((val)=>{
                res.json({message: "Routine created successfully"})
            })
            .catch((err)=>{
                res.json({message: "Something went wrong"})
            })
        }
        else{
            RoutineModel.findByIdAndUpdate(doc[0]._id, {
                url: req.file.location
            })
            .then((val)=>{
                res.json({message: "Routine updated successfully"})
            })
            .catch((err)=>{
                res.json({message: "Something went wrong"})
            })
        }
    })
    .catch((err)=>{

        console.log(err)
        res.json({message: "Something went wrong"})
        
    })
})

module.exports = app