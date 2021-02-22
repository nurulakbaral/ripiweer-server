const jwt = require('jsonwebtoken')

const tokenVerify = (req, res, next) => {
    const tokenClient = req.cookies.jwt
    const userValid = res.locals.usernameValid._doc
    jwt.verify(tokenClient, 'secret token', (error, decodedToken) => {
        if (error) {
            const isUsernameExist = userValid.username
            if (!isUsernameExist) {
                res.status(400).json({ errors: 'Token is wrong' })
            }
            res.locals.currentUser = userValid
            next()
        }
        const currentUser = { ...userValid, currentUserId: decodedToken.userId }
        res.locals.currentUser = currentUser
        // console.log(decodedToken.userId)
        next()
    })
}

module.exports = tokenVerify