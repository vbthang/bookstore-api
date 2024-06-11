'use strict'

const {
    uploadImageFromUrl, 
    uploadImageFromLocal,
    uploadImageFromLocalS3
} = require('../services/upload.service')
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

    uploadFileFromLocalS3 = async (req, res, next) => {
        const { file } = req
        if(!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'upload successfully use S3Client',
            metadata: await uploadImageFromLocalS3({
                file
            })
        }).send(res)
    }
}

module.exports = new UploadController()