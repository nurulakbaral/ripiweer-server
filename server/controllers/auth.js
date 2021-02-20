const User = require('../models/User')
const jwt = require(`jsonwebtoken`)

// Utils
const getDays = (day) => {
    return day * 60 * 60 * 1000
}
const createToken = (userId) => {
    return jwt.sign({ userId }, 'secret token', {
        expiresIn: getDays(3)
    })
}

// Routes
const registerPost = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const userData = await User.create({ fullName, email, password })
        const token = createToken(userData._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: getDays(3) })
        res.status(200).json({ token: token })
    } catch (err) {
        console.log({ errors: err.message })
        res.status(400).json({ errors: err.message })
    }
}
const loginPost = async (req, res) => {
    const userDataLogin = req.body
    try {
        const userDataValid = await User.login(userDataLogin)
        const token = createToken(userDataValid._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: getDays(3) })
        res.status(200).json({ token: token })
    } catch (error) {
        res.status(400).json({ errors: error.message })
    }
}
const logoutGet = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).send("Anda telah logout")
}

module.exports = { registerPost, loginPost, logoutGet } 