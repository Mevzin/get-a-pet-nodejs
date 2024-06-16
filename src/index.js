const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/user.routes')
require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static('public'))

app.use('/users', UserRoutes)

app.listen(5000)