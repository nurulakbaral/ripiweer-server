const { Router } = require('express')
const { registerPost, loginPost, logoutGet } = require('../controllers/auth')
const router = Router()

router.post('/register', registerPost)
router.post('/login', loginPost)
router.get('/logout', logoutGet)

module.exports = router 
