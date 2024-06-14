
require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const {v4:uuidv4}= require('uuid')
const MyLogger = require('./api/v1/loggers/mylogger.log')

// init middlewares
// app.use(express.json())
app.use(morgan("dev"))
app.use(helmet()) // Ngăn chặn bên thứ 3 đọc thông tin nhạy cảm
app.use(compression()) // Nén dữ liệu trước khi gửi đi => Giảm dữ liệu gửi đi => Giảm chi phí
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// test pub.sub redis
require('./api/v1/test/inventory.test')
const bookTest = require('./api/v1/test/book.test')
const myloggerLog = require('./api/v1/loggers/mylogger.log')
bookTest.purchaseBook('book:001', 10)

app.use((req, res, next) => {
  const requestId = req.header['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  MyLogger.log(`input params ::${req.method}`, [
    req.path,
    {requestId: req.requestId},
    req.method === 'POST' ? req.body : req.query
  ])

  next()
})

// init db
require('./api/v1/dbs/init.mongodb')
const initRedis = require('./api/v1/dbs/init.redis')
initRedis.initRedis()
// const { countConnect } = require('./api/v1/helpers/check.connect')
// countConnect()
// init routes
app.use('', require('./api/v1/routes'))

// init error handler
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
  MyLogger.error(resMessage, [
    req.path,
    {requestId: req.requestId},
    {
      message: error.message
    }
  ])

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app