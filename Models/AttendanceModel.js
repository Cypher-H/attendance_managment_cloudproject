const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema


const Attendance = new Schema({
    mark: Number,
    date: Date,
    Subject: {
        type: mongoose.Types.ObjectId,
        ref: 'SubjectModel'
    },
    Student: {
        type: mongoose.Types.ObjectId,
        ref: 'StudentModel'
    }
})

Attendance.plugin(mongooseUniqueValidator)

const AttendanceModel = mongoose.model('AttendanceModel', Attendance)
module.exports = AttendanceModel