'use strict'

const {
  BadRequestError,
  NotFoundError
} = require('../core/error.response')

const { 
  findCartById,
  checkBookByServer
} = require("../models/repositories/cart.repo")

const {
  convertToObjectIdMongodb
} = require('../utils')
const discountService = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const orderModel = require('../models/order.model')


class CheckoutService {
  // login and without login
  /*
    {
      cartId,
      customerId,
      shop_order_ids: [
        {
          shopId, 
          shop_discount: [],
          item_books: [
            {
              price,
              quantity,
              bookId
            }
          ]
        },
        {
          shopId, 
          shop_discount: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_books: [
            {
              price,
              quantity,
              bookId
            }
          ]
        },
      ]
    }
  */
  static async checkoutReview({
    cartId, customerId, shop_order_ids
  }) {
    // check cartId ton tai ?
    const foundCart = await findCartById(cartId)
    if(!foundCart) throw new BadRequestError('Cart does not exists!')

    const checkout_order = {
      totalPrice: 0, // Tong tien hang
      feeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong thanh toan
    }
    const shop_order_ids_new = []

    // Tinh tong bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_books = [] } = shop_order_ids[i]
      // check book available
      const checkBookServer = await checkBookByServer(item_books)
      
      if(!checkBookServer[0]) throw new BadRequestError('order wrong')
      // tong tien don hang

      const checkoutPrice = checkBookServer.reduce((acc, book) => {
        return acc + (book.quantity * book.price)
      }, 0)

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        items_books: checkBookServer
      }
      // neu shop_discounts ton tai > 0, check xem co hop le khong
      if(shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await discountService.getDiscountAmount({
          codeId: shop_discounts[0].codeId, 
          userId: customerId, 
          shopId, 
          books: checkBookServer
        })
        checkout_order.totalDiscount += discount
        if(discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)

    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    customerId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      customerId,
      shop_order_ids
    })

    // check lai 1 lan nua
    // get new array Book
    const books = shop_order_ids_new.flatMap( order => order.items_books )
    console.log(`[1]::`, books)
    const acquireBook = []
    for (let i = 0; i < books.length; i++) {
      const { bookId, quantity } = bookId[i]
      const keyLock = await acquireLock(bookId, quantity, cartId)
      acquireBook.push(keyLock ? true : false)
      if(keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check neu co 1 sp het han trong kho
    if(acquireBook.includes(false0)) {
      throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang...')
    }

    const newOrder = await orderModel.create({
      order_customerId: customerId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_books: shop_order_ids_new
    })

    // truong hop: neu insert thanh con, thi remove product co trong cart
    if(newOrder) {
      // remove book in my cart
    }

    return newOrder
  }

  /*
    1> Query Orders[Customer]
  */
  static async getOrdersByCustomer() {
    
  }

  /*
    1> Query Order Using Id[Customers]
  */
  static async getOneOrderByCustomer() {

  }

  /*
    1> Cancel Order[Customers]
  */
  static async cancelOrderByCustomer() {

  }

  /*
    1> Update Order Status[Admin | Shop]
  */
  static async updateOrderStatusByShop() {
    
  }
}

module.exports = CheckoutService