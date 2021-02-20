const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    }
})

// Invoke a function before data saved to database
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Static methods
UserSchema.statics.login = async function (userDataLogin) {
    const { email, password } = userDataLogin
    const userDataValid = await this.findOne({ email })
    const userPasswordValid = await bcrypt.compare(password, userDataValid.password)
    if (userDataValid && userPasswordValid) {
        return userDataValid
    }
    throw Error('Email or password is wrong!')
}

const User = mongoose.model('user', UserSchema)
module.exports = User

