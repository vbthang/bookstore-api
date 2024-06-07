'use strict'

const cloudinary = require('../../../config/cloudinary.config')

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
    uploadImageFromLocal
}