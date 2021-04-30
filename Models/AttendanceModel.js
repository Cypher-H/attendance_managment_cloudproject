const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const Attendance = new Schema({
  date: {
    type: String,
    required: true,
  },
  day: String,
  time: String,
  Student: {
    type: mongoose.Types.ObjectId,
    ref: "StudentModel",
  },
});

Attendance.index({Student: 1, date: 1}, { unique: false})

Attendance.plugin(mongooseUniqueValidator);

const AttendanceModel = mongoose.model("AttendanceModel", Attendance);
module.exports = AttendanceModel;
