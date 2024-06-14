'use strict'

const USER = require('../models/user.model')
const { ErrorResponese, BadRequestError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')
const {sendEmailToken} = require('./email.service')

const newUserService = async ({
    email = null,
    capcha = null
}) => {
    // 1.check email exists in dbs
    const user = await USER.findOne({ email }).lean()

    // 2. if exists
    if (user) {
        throw new ErrorResponese({
            message: 'Email is exists'
        })
    }

    // 3. send token via email
    const result = await sendEmailToken({
        email
    })

    return {
        'token': result
    }

}

module.exports = {
    newUserService
}