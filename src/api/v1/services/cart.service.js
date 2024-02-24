'use strict'

const {
  BadRequestError,
  NotFoundError
} = require('../core/error.response')
const cartModel = require('../models/cart.model')
const { 
  findAllBooks, getBookById 
} = require('../models/repositories/book.repo')
const { convertToObjectIdMongodb } = require('../utils')

/*
  Key features Cart Service:
  - add product to cart [user]
  - reduce product quantity by one [user]
  - increase product quantity by one [user]
  - get cart [user]
  - del cart [user]
  - del cart item [user]
*/

class CartService {

  // START REPO CART
  static async createCustomerCart({
    customerId, book
  }) {
    const query = { cart_customerId: customerId, cart_state: 'active' }
    const updateOrInsert = {
      $addToSet: { cart_books: book }
    }
    const options =  { upsert: true, new: true }

    return await cartModel.findOneAndUpdate( query, updateOrInsert, options )
  }

  static async updateCustomerCartQuantity({
    customerId, book
  }) {
    const { bookId, quantity } = book
    const query = { 
      cart_customerId: customerId, 
      'cart_books.bookId': bookId,
      cart_state: 'active'
    }
    const updateSet = {
      $inc: {
        'cart_books.$.quantity': +quantity
      }
    }
    const options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate( query, updateSet, options )
  }
  // END REPO CART

  static async addToCart({
    customerId, book = {}
  }) {
    // check cart exist
    const customerCart = await cartModel.findOne({ cart_customerId: 123})
    
    if(!customerCart) {
      // Create new cart
      return await CartService.createCustomerCart({ customerId, book })
    }

    // If cart exist but not have book
    if(!customerCart.cart_books.length) {
      customerCart.cart_books = [book]
      return customerCart.save()
    }

    // If cart and book exist => update quantity
    return await CartService.updateCustomerCartQuantity({ customerId, book })
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_books: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            quantity,
            bookId
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ customerId, shop_order_ids = {} }) {
    const { bookId, quantity, old_quantity } = shop_order_ids[0]?.item_books[0]
    // Check book
    const foundBook = await getBookById(convertToObjectIdMongodb(bookId))
    if(!foundBook) throw new NotFoundError('Not found Book')
    // compare

    console.log(foundBook.book_shop)
    console.log(convertToObjectIdMongodb(shop_order_ids[0]?.shopId))
    if(!foundBook.book_shop.equals(shop_order_ids[0]?.shopId)) {
      throw new NotFoundError('Book do not belong to the shop')
    }
    
    if(quantity === 0) {
      // DELETE
      this.deleteCustomerCart({ customerId, bookId })
    }

    return await this.updateCustomerCartQuantity({
      customerId,
      book: {
        bookId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteCustomerCart({ customerId, bookId }) {
    const query = { cart_customerId: customerId, cart_state : 'active' }
    const updateSet = {
      $pull: {
        cart_books : {
          bookId
        }
      }
    }
    const deleteCart = await cartModel.updateOne( query, updateSet )

    return deleteCart
  }

  static async getListCustomerCart({ customerId }) {
    return await cartModel.findOne({
      cart_customerId: +customerId
    }).lean()
  }
}

module.exports = CartService