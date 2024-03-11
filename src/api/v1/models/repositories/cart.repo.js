'use strict'

const { convertToObjectIdMongodb } = require('../../utils')
const cartModel = require('../cart.model')
const { getBookById } = require('./book.repo')

const findCartById = async (cartId) => {
  return await cartModel.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active'}).lean()
}

const checkBookByServer = async (books) => {
  return await Promise.all( books.map( async book => {
    const foundBook = await getBookById(book.bookId)
    if(foundBook) {
      return {
        price: foundBook.book_price,
        quantity: book.quantity,
        bookId: book.bookId
      } 
    }
  }))
}

module.exports = {
  findCartById,
  checkBookByServer
}