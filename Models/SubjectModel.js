const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema


const Subject = new Schema({
    Name: String,
    Credit: Number,
    Teacher: {
        type: mongoose.Types.ObjectId
    },
    Students: {
        type: [{type: mongoose.Types.ObjectId, ref: 'StudentModel'}]
    }
})

Subject.plugin(mongooseUniqueValidator)

const SubjectModel = mongoose.model('SubjectModel', Subject)
module.exports = SubjectModel