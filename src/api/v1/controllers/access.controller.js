'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const { BadRequestError } = require("../core/error.response")

class AccessController {
  handleRefreshToken = async ( req, res, next) => {
    new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    }).send(res)
  }

  logout = async ( req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async ( req, res, next) => {
    const { email } = req.body
    if(!email) {
      throw new BadRequestError('Email is required!')
    }

    const sendData = Object.assign({
      requestId: req.requestId
    }, req.body)

    new SuccessResponse({
      metadata: await AccessService.login(sendData)
    }).send(res)
  }

  signUp = async ( req, res, next ) => {
    new CREATED({
      message: 'Registered OK',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
    // return res.status(201).json(await AccessService.signUp(req.body))
  }
}

module.exports = new AccessController()