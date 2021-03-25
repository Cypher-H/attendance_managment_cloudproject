const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const bycryptjs = require('bcryptjs')
const User = require('./Models/UserModel')
const config = require('./config')


const app = express.Router()

app.post('/register', (req, res, next)=>{
    const { username, password } = req.body
    if (username && password){
        bycryptjs.hash(password, 8)
        .then((value)=>{
            User.create({
                username: username,
                password: value,
                role: 'student'
            })
            .then((doc)=>{
                const token = jsonwebtoken.sign({id: doc._id}, config.secret, {
                    expiresIn: 3600
                })
                const decoded = jsonwebtoken.decode(token)
                res.status(200).json({auth: true, token: token, status: 'loggedIn', uid: doc._id, role: doc.role, exp: decoded.exp})
            })
            .catch((er)=>{
                res.status(200).json({auth: false, status: er.message, token: null})
            })
        })
    }
    else{
        res.status(500).json({auth: false, status: 'Unable to find username or password'})
    }
})

app.post('/login', (req, res, next)=>{
    const { username, password } = req.body
    if (username && password) {
        User.findOne({username: username})
        .then((doc)=>{ 
            if (doc !== null) {
                const isValid = bycryptjs.compareSync(password, doc.password)
                if (isValid){
                    const token = jsonwebtoken.sign({id: doc._id}, config.secret, {
                        expiresIn: 3600 //86400
                    })
                    const decoded = jsonwebtoken.decode(token)
                    res.status(200).json({auth: true, token: token, status: 'loggedIn', uid: doc._id, role: doc.role, exp: decoded.exp})
                }
                else{
                    res.status(200).json({auth: false, token: null, status: 'Incorrect Password', uid: doc._id})
                }
            }
            else {
                res.status(200).json({auth: false, token: null, status: 'Incorrect Username Or Password', uid: null})
            }
        })    
    }
    else{
        res.status(500).json({auth: false, status: 'Unable to find username or password'})
    }
})

app.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null, status: 'Logged-Out' });
});

module.exports = app