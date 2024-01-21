'use strict'

const BookService = require("../services/book.service")

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class BookController {
  createBook = async (req, res, next ) => {
    new SuccessResponse({
      message: 'Create new Book success!',
      metadata: await BookService.createBook(req.body.book_type, {
        ...req.body,
        book_shop: req.body.book_shop
      })
    }).send(res)
  }
}

module.exports = new BookController()