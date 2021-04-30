const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Enrollment = new Schema({
  verified: Boolean,
  Subject: {
    type: mongoose.Types.ObjectId,
    ref: "SubjectModel",
  },
  Student: {
    type: mongoose.Types.ObjectId,
    ref: "StudentModel",
  },
});


const EnrollmentModel = mongoose.model("EnrollmentModel", Enrollment);
module.exports = EnrollmentModel;