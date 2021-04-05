const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema


const Marks = new Schema({
    mark: Number,
    Subject: {
        type: mongoose.Types.ObjectId,
        ref: 'SubjectModel'
    },
    Student: {
        type: mongoose.Types.ObjectId,
        ref: 'StudentModel'
    }
})

Marks.plugin(mongooseUniqueValidator)

const MarksModel = mongoose.model('MarksModel', Marks)
module.exports = MarksModel