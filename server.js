const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 80

// Asset
app.use(express.static(path.join(__dirname, 'public')))

// Set template engine
// app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})