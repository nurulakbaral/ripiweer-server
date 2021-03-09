const User = require('../models/User')

const usernameVerify = async (req, res, next) => {
    const username = req.params.username
    try {
        res.locals.usernameValid = await User.usernameVerify(username)
        next()
    } catch (error) {
        res.status(400).json({ errors: 'Username doesnt exit' })
    }
    // next()
}

module.exports = usernameVerify