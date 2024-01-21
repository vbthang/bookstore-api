'use strict'

const express = require('express')
const bookController = require('../../controllers/book.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// authentication //
router.use(authentication)
router.post('', asyncHandler(bookController.createBook))

module.exports = router