'use strict'

const express = require('express')
const bookController = require('../../controllers/book.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(bookController.getListSearchBook))
router.get('/:book_id', asyncHandler(bookController.findBook))
router.get('', asyncHandler(bookController.findAllBooks))

// authentication //
router.use(authentication)
router.post('', asyncHandler(bookController.createBook))
router.patch('/:bookId', asyncHandler(bookController.updateBook))
router.post('/publish/:id', asyncHandler(bookController.publishBookByShop))
router.post('/unpublish/:id', asyncHandler(bookController.unPublishBookByShop))

// QUERY //
router.get('/draft/all', asyncHandler(bookController.getAllDraftForUser))
router.get('/published/all', asyncHandler(bookController.getAllPublishForUser))
// END QUERY //

module.exports = router