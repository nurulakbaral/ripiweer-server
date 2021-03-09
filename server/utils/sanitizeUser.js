const sanitizeUser = (obj, props) => {
    const sanitizedUser = { ...obj._doc }
    for (prop in props) {
        delete sanitizedUser[prop]
    }
    return sanitizedUser
}

module.exports = { sanitizeUser }