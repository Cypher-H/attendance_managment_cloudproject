const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const Teacher = new Schema({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  email: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "UserModel",
  },
  Subjects: {
    type: [{ type: mongoose.Types.ObjectId, ref: "SubjectModel" }],
  },
});

Teacher.plugin(mongooseUniqueValidator);

const TeacherModel = mongoose.model("TeacherModel", Teacher);
module.exports = TeacherModel;
