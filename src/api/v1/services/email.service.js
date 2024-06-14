'use strict'

const { newOtp } = require('./otp.service')
const { getTemplate } = require("./template.service")
const { transport } = require('../dbs/init.nodemailer')
const { replacePlaceholder } = require('../utils')
const { NotFoundError } = require('../core/error.response')

const sendEmailLinkVarify = async ({
    html,
    toEmail,
    subject = 'Email Verification',
    text = 'Confirm your email address'
}) => {
    try {
        const mailOptions = {
            from: '"BookStore" <thangvb.dev@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        }

        transport.sendMail(mailOptions, (err, info) => {
            if(err) {
                return console.log(err)
            }

            console.log(`Message sent::`, info.messageId)
        })
    } catch (error) {
        console.error(error)
        return err
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {       
        // 1. Generator token
        const token = await newOtp({ email })
        
        // 2. Get template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN',
        })

        if(!template) {
            throw new NotFoundError('Template not found')
        }

        // 3. replaceholder
        const content = replacePlaceholder(
            template.tem_html,
            {
                link_verify: `http://localhost:8081/cgp/welcomeback?token=${token.otp_token}`
            }
        )

        sendEmailLinkVarify({
            toEmail: email,
            html: content,
            subject: 'Confirm your email address',
        }).catch(err => console.log(err))

        return 1
        // return content
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmailToken
}