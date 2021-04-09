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
const passport = require('passport')
const Emitter = require('events')
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

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitterKey', eventEmitter)

// Session config (session library works as a middleware)
app.use(session({
    secret: process.env.COOKIE_SECRET, // used to encrypt our cookies
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} // cookie session created here will be valid for 24 hours
}))

app.use(flash())

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// Asset
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Global Middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// Set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Calling routes here
require('./routes/web')(app)

// Listening
const server = app.listen(PORT, (req, res) => {
                console.log(`Listening on port ${PORT}`)
            })

// Socket.io integration
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Private room creation (unique ID)
    // Join
    console.log(socket.id)
    socket.on('join', (roomName) => {
        socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdatedEvent', data) // We'll recieve 'orderUpdatedEvent' on the client side
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlacedEvent', data)
})