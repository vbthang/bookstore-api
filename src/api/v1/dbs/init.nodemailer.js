'use strict'

const nodemailer = require('nodemailer')

// const transport = nodemailer.createTransport({
//     host: '',
//     port: 587,
//     secure: true,
//     auth: {
//         user: '',
//         pass: ''
//     }
// })

const transport = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = {
    transport
}