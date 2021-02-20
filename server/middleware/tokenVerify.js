const jwt = require('jsonwebtoken')

const tokenVerify = (req, res, next) => {
    const tokenClient = req.cookies.jwt
    // check json web token exists & is verified
    if (!tokenClient) {
        res.status(400).json({ errors: 'Token is not available' })
    }
    jwt.verify(tokenClient, 'secret token', (err, decodedToken) => {
        if (err) {
            res.status(400).json({ errors: 'Token is wrong' })
        }
        next()
    })
}

module.exports = tokenVerify