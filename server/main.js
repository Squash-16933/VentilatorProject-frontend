// Note: working directory is root

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors()) // Sort of a security risk, disable before building for production

// These folders are static and public
app.use('/assets', express.static(path.resolve('./assets')))
app.use('/build', express.static(path.resolve('./build')))

require('./routes')(app)

const PORT = process.env.port || 80
app.listen(PORT)
console.log(`Server started on port ${PORT}`)