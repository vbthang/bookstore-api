'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

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
    console.log(`Body : `)
    console.log(req.body)
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
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