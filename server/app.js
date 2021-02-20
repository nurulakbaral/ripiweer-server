// Packages
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const tokenVerify = require('./middleware/tokenVerify')

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
app.post('/', (req, res) => {
    res.send("Success!")
})
app.get('/profile', tokenVerify, (req, res) => {
    try {
        res.send("Token diterima!")
    } catch (error) {
        res.status(400).send({ errors: console.error() })
    }
})
app.get('/events', (req, res) => {
    try {
        res.send("Event public!")
    } catch (error) {
        res.status(400).send({ errors: console.error() })
    }
})
app.use(authRoutes)
