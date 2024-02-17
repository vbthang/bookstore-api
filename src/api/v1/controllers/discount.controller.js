'use strict'

const DiscountService = require("../services/discount.service")
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful Code Generations',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.headers['x-client-id']
      })
    }).send(res)
  }

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful Code Found',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.headers['x-client-id']
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful Code Found',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

  getAllDiscountCodesWithBook = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful Code Found',
      metadata: await DiscountService.getAllDiscountCodesWithBook({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new DiscountController()