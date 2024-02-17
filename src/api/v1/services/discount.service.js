'use strict'

const {
  BadRequestError,
  NotFoundError
} = require('../core/error.response')
const discountModel = require('../models/discount.model')
const { 
  findAllBooks 
} = require('../models/repositories/book.repo')
const { 
  findAllDiscountCodesUnSelect, findAllDiscountCodesSelect, checkDiscountExists 
} = require('../models/repositories/discount.repo')
const { convertToObjectIdMongodb } = require('../utils')
/*
  Discount Services
  1 - Generator Discount Code [Shop | Admin]  
  2 - Get discount amount [User]
  3 - Get all discount codes [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]  
  6 - Cancel discount code [User]
*/

class DiscountService {

  static async createDiscountCode (payload) {
    const {
      code, start_date, end_date, is_active, shopId, min_order_value, book_ids, applies_to, name, description, type, value, max_uses, uses_count, max_uses_per_user, users_used
    } = payload
    // Check
    if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!')
    }
    if(new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end_date!')
    }
    // create index for discount code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if(foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists!')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_book_ids: applies_to === 'all' ? [] : book_ids,
    })

    return newDiscount
  }

  static async updateDiscountCode() {
    // Code
  }

  static async getAllDiscountCodesWithBook({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if(!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not exists!')
    }

    const { discount_applies_to, discount_book_ids } = foundDiscount
    let books

    if(discount_applies_to === 'all') {
      books = await findAllBooks({
        filter: {
          book_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['book_name']
      })
    }

    if(discount_applies_to === 'specific') {
      books = await findAllBooks({
        filter: {
          _id: {$in: discount_book_ids},
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['book_name']
      })
    }

    return books
  }

  /*
  get all discount of Shop 
  */
  static async getAllDiscountCodesByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      select: ['discount_name', 'discount_code'],
      model: discountModel
    })

    return discounts
  }

  /*
  Apply Discount Code
  books = [
    {
      bookId,
      shopId,
      quantity,
      name,
      price
    }
  ]
  */
  static async getDiscountAmount({ codeId, userId, shopId, books }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if(!foundDiscount) throw new NotFoundError(`discount doesn't exist`)
    console.log(foundDiscount)
    const { 
      discount_is_active, discount_max_uses, discount_start_date, discount_end_date,
      discount_min_order_value, discount_type, discount_max_uses_per_user, discount_users_used,
      discount_value
    } = foundDiscount

    if(!discount_is_active) throw new NotFoundError(`discount expired`)
    if(!discount_max_uses) throw new NotFoundError(`discount are out`)

    if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new NotFoundError(`discount encode has expired`)

    let totalOrder = 0
    if(discount_min_order_value > 0) {
      // get total
      totalOrder = books.reduce((acc, book) => {
        return acc + (book.quantity * book.price)
      }, 0)
    }

    if(totalOrder < discount_min_order_value) throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}!`)

    if(discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find( user => user.userId === userId )
      console.log('----------')
      console.log(userUsedDiscount)
      console.log('----------')
      if(userUsedDiscount) {
        //...
      }
    }

    // check discount fixed_amount - ...
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({
    shopId, codeId
  }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    })

    return deleted
  }

  static async cancelDiscountCode ({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if(!foundDiscount) throw new NotFoundError(`discount doesn't exist`)

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}

module.exports = DiscountService