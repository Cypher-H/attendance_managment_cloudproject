const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const Student = new Schema({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  email: {
    type: String,
  },
  idnumber: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "UserModel",
  },
  rfid: {
    type: Number
  },
  url: {
    type: String
  },
  Subjects: {
    type: [{ type: mongoose.Types.ObjectId, ref: "SubjectModel" }],
  },
});

Student.plugin(mongooseUniqueValidator);

const StudentModel = mongoose.model("StudentModel", Student);
module.exports = StudentModel;
