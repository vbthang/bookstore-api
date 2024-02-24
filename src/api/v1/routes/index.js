'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()
// Check apiKey
router.use(apiKey)
// Check permission
router.use(permission('0000'))

router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/book', require('./book'))
router.use('/v1/api', require('./access'))

module.exports = router