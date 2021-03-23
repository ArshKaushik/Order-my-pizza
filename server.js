require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const PORT = process.env.PORT || 80

// Database
const url = 'mongodb://localhost/pizza'
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true})

const connection = mongoose.connection
connection.once('open', () => {
    console.log('Database connected...')
}).catch(err => {
    console.log('Connection failed...')
})

// Session store
let mongoStore = new MongoDbStore({
                    mongooseConnection: connection,
                    collection: 'sessions'
                })

// Session config (session library works as a middleware)
app.use(session({
    secret: process.env.COOKIE_SECRET, // used to encrypt our cookies
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} // cookie session created here will be valid for 24 hours
}))

app.use(flash())

// Asset
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

// Global Middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

// Set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Calling routes here
require('./routes/web')(app)

// Listening
app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})