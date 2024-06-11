'use strict'

const cloudinary = require('../../../config/cloudinary.config')
const crypto = require('crypto')
// const {
//     s3,
//     PutObjectCommand
// } = require('../../../config/s3.config')
const {
    s3,
    PutObjectCommand,
    GetObjectCommand, 
    DeleteObjectCommand
} = require('../../../config/s3.config')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const randomImageName = () => crypto.randomBytes(16).toString('hex')

// START UPLOAD FILE USE S3CLIENT

// 1.UPLOAD FROM IMAGE LOCAL BY S3

const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {
        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.DO_BUCKET_NAME,
            Key: imageName, //file.orginalname || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        // 1. AWS
        const result = await s3.send( command )
        // 2.DO
        // const result = await s3.putObject(obj)
        console.log(result)
        
        // export url
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.DO_BUCKET_NAME,
            Key: imageName
        })
        const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 })
        console.log(`url:`, url)

        return url

    } catch (err) {
        console.error(err)
    }
}





// END UPLOAD FILE USE S3CLIENT

// 1.UPLOAD FROM URL IMAGE
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://i.pinimg.com/736x/53/7c/a7/537ca76aecdf594d0b3701b59bb8dc8f.jpg'
        const folderName = 'product/8409', newFileName = 'testdemo2'

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })
        console.log(result)
        return result   
    } catch (err) {
        console.error(err)
    }
}

// 2.UPLOAD FROM IMAGE LOCAL

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8409'
}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })
        console.log(result)
        return {
            image_url: result.secure_url,
            shopId: '8409',
            thumb_url: await cloudinary.url(result.public_id, {
                width: 200,
                height: 200,
                crop: 'fill',
                format:'jpg'
            })
        }   
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalS3
}