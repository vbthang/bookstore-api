'use strict'

const express = require('express')
const NotificationController = require('../../controllers/notificatio.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// not login

// authentication //
router.use(authentication)
////////////////////

router.get('', asyncHandler(NotificationController.listNotiByUser))

module.exports = router