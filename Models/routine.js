const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Routine = new Schema({
  url: String
});

const RoutineModel = mongoose.model("RoutineModel", Routine);
module.exports = RoutineModel;
