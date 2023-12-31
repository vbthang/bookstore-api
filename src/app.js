
require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middlewares
// app.use(express.json())
app.use(morgan("dev"))
app.use(helmet()) // Ngăn chặn bên thứ 3 đọc thông tin nhạy cảm
app.use(compression()) // Nén dữ liệu trước khi gửi đi => Giảm dữ liệu gửi đi => Giảm chi phí
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// init db
require('./api/v1/dbs/init.mongodb')
// const { countConnect } = require('./api/v1/helpers/check.connect')
// countConnect()

// init routes
app.use('', require('./api/v1/routes'))

// inti error handler

module.exports = app