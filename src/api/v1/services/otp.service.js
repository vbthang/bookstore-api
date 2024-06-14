'use strict'

const { randomInt } = require('crypto')
const OTP = require('../models/otp.model')

const generatorTokenRandom = () => {
    const token = randomInt(0, Math.pow(2, 32))
    return token
}

const newOtp = async ({
    email
}) => {
    const token = generatorTokenRandom()
    const newToken = await OTP.create({
        otp_token: token,
        otp_email: email
    })

    return newToken
}

module.exports = {
    newOtp
}