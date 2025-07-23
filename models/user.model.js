const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3,'Username must be atleast 3 characters long !!']
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13,'Email must be atleast 13 characters long !!']
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: [5, 'Password must contain atleast 5 characters !!']
    }

})


const user = mongoose.model('user', userSchema)

module.exports = user
