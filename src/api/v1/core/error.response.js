'use strict'

// const myloggerLog = require('../loggers/mylogger.log')
// const logger = require("../loggers/winston.log")
const MyLogger = require('../loggers/mylogger.log')

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  NOTFOUND: 404
}

const ReasonStatusCode = {
  FORBIDDEN: 'Bad request',
  CONFLICT: 'Conflict error',
  UNAUTHORIZED: '...',
  NOTFOUND: 'Not found!!!'
}

class ErrorResponse extends Error {
  constructor( message, status) {
    super(message)
    this.status = status
    this.now = Date.now()

    // Log the error use winston
    // logger.error(`${this.status} - ${this.message}`)
    // MyLogger.error(this.message, ['/api/v1/login', 'vv123', {error: 'Bad req err'}])
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message,statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message,statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message,statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOTFOUND, statusCode = StatusCode.NOTFOUND) {
    super(message,statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message,statusCode)
  }
}

// redis error
class RedisErrorResponse extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message,statusCode)
  }
}


module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  RedisErrorResponse
}