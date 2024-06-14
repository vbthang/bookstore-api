'use strict'

const { SuccessResponse } = require('../core/success.response')
const {newUserService} = require('../services/user.service')

class UserController {
    // new user
    newUser = async (req, res, next) =>  {
        new SuccessResponse({
            message: 'Create new user successfully',
            metadata: await newUserService({
                email: req.body.email
            })
        }).send(res)
    }

    // check user token via Email
    checkRegisterEmailToken = async () => {
        
    }
}

module.exports = new UserController()