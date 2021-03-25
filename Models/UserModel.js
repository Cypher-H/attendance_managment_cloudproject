const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema


const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student'
    }
})

User.plugin(mongooseUniqueValidator)

const UserModel = mongoose.model('UserModel', User)
module.exports = UserModel