'use strict'

const {uploadImageFromUrl, uploadImageFromLocal} = require('../services/upload.service')
const { SuccessResponse } = require('../core/success.response')
const { BadRequestError } = require('../core/error.response')

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: 'upload successfully',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if(!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'upload successfully',
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }
}

module.exports = new UploadController()