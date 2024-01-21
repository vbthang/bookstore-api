'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// signUp
router.post('/user/signup', asyncHandler(accessController.signUp))
router.post('/user/login', asyncHandler(accessController.login))

// authentication //
router.use(authentication)
router.post('/user/logout', asyncHandler(accessController.logout))
router.post('/user/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

module.exports = router