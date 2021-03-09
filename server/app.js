// Packages
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const tokenVerify = require('./middleware/tokenVerify')
const usernameVerify = require('./middleware/usernameVerify')
const User = require('./models/User')
const { sanitizeUser } = require('./utils/sanitizeUser')


// Setup
dotenv.config()
const app = express()

// Database config
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(PORT, () => { console.log(`Success : Running on PORT ${PORT}`) }))
    .catch((errors) => console.log(errors))

//  Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../build')))
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        optionSuccessStatus: 200,
    })
)

// App routes
// Notes : Urutan peletakan routes harus diperhatikan karena berjalan secara sekuensial
app.use(authRoutes)
app.get('/:username', [usernameVerify, tokenVerify], (req, res) => {
    try {
        const userValid = res.locals.currentUser
        // Fix/Bugs : Refactor delete property dengan fungsi util sanitizeUser
        delete userValid.password
        res.status(200).json(userValid)
    } catch (error) {
        res.status(400).send({ errors: error })
    }
})
app.post('/favorite/:username', [usernameVerify], async (req, res) => {
    const username = req.params.username
    const { favoriteName, iconName } = req.body
    try {
        const addDataFavorite = await User.addFavorite({ username, favoriteName, iconName })
        const { password } = addDataFavorite
        const sanitizedUser = sanitizeUser(addDataFavorite, { password })
        res.status(200).json(sanitizedUser)
    } catch (error) {
        res.status(400).json({ error: error })
    }
})
