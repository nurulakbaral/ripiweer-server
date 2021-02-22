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
        // Notes : username pada daftar adalah default username
        const [username] = email.split('@')
        const userData = await User.create({ fullName, username, email, password })
        delete userData._doc.password
        const token = createToken(userData._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: getDays(3) })
        res.status(200).json(userData)
    } catch (error) {
        console.log({ errors: error.message })
        res.status(400).send({ errors: error.message })
    }
}
const loginPost = async (req, res) => {
    const userDataLogin = req.body
    try {
        const userDataValid = await User.login(userDataLogin)
        delete userDataValid._doc.password
        const token = createToken(userDataValid._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: getDays(3) })
        res.status(200).json(userDataValid)
    } catch (error) {
        res.status(400).json({ errors: error.message })
    }
}
const logoutGet = async (req, res) => {
    try {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 1 })
        res.status(200).json('Berhasil logout!')
    } catch (error) {
        res.status(400).json({ errors: error })
    }
}

module.exports = { registerPost, loginPost, logoutGet } 