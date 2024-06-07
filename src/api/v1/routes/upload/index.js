'use strict'

const express = require('express')
const UploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../../../config/multer.config')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// not login

// authentication //
// router.use(authentication)
////////////////////

router.get('/product', asyncHandler(UploadController.uploadFile))
router.get('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadFileThumb))

module.exports = router