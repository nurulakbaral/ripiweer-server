const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const { Schema } = mongoose
const userSchema = new Schema({
    avatarUrl: {
        type: String
    },
    fullName: {
        type: String,
        required: [true, 'Please enter a full name'],
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter a username name'],
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
    },
    bio: {
        type: String,
        maxlength: [100, 'Maximum bio length is 100 characters']
    },
    favorites: [{ name: String, iconName: String }],
    gender: {
        type: String,
    },
    birthday: {
        type: Date
    },
})

// Invoke a function before data saved to database
userSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

// Static methods
userSchema.statics.login = async function (userDataLogin) {
    const { email, password } = userDataLogin
    const userDataValid = await this.findOne({ email })
    const userPasswordValid = await bcrypt.compare(password, userDataValid.password)
    if (userDataValid && userPasswordValid) {
        return userDataValid
    }
    throw Error('Email or password is wrong!')
}
userSchema.statics.usernameVerify = async function (username) {
    const usernameValid = await this.findOne({ username })
    if (usernameValid) {
        return usernameValid
    }
    throw Error(username)
}
userSchema.statics.addFavorite = async function ({ username, favoriteName, iconName }) {
    const usernameValid = await this.findOne({ username })
    const newFavorite = {
        name: favoriteName,
        iconName: iconName
    }
    usernameValid.favorites.push(newFavorite)
    usernameValid.save()
    if (usernameValid) {
        return usernameValid
    }
    throw Error(username)
}

const User = mongoose.model('User', userSchema)
module.exports = User

