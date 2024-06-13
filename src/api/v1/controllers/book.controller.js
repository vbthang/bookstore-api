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

  updateBook = async (req, res, next ) => {
    new SuccessResponse({
      message: 'Update Book success!',
      metadata: await BookService.updateBook(req.body.book_type, req.params.bookId, {
        ...req.body,
        book_shop: req.headers['x-client-id']
      })
    }).send(res)
  }

  publishBookByShop = async (req, res, next ) => {
    new SuccessResponse({
      message: 'publishBookByShop success!',
      metadata: await BookService.publishBookByUser({
        book_shop: req.headers['x-client-id'],
        book_id: req.params.id
      })
    }).send(res)
  }

  unPublishBookByShop = async (req, res, next ) => {
    new SuccessResponse({
      message: 'unPublishBookByUser success!',
      metadata: await BookService.unPublishBookByUser({
        book_shop: req.headers['x-client-id'],
        book_id: req.params.id
      })
    }).send(res)
  }

  // QUERY //
  /**
   * @desc Get all Drafts for user
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllDraftForUser = async (req, res, next) => {
    console.log(req.headers)
    new SuccessResponse({
      message: 'Get list Draft success',
      metadata: await BookService.findAllDraftForUser({
        book_shop: req.headers['x-client-id']
      })
    }).send(res)
  }

  getAllPublishForUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Published success',
      metadata: await BookService.findAllPublishForUser({
        book_shop: req.headers['x-client-id']
      })
    }).send(res)
  }

  getListSearchBook = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list SearchBook success',
      metadata: await BookService.searchBooks(req.params)
    }).send(res)
  }

  findAllBooks = async (req, res, next) => {
    console.log('TEST');
    new SuccessResponse({
      message: 'Get list findAllBooks success',
      metadata: await BookService.findAllBooks(req.query)
    }).send(res)
  }

  findBook = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list findBook success',
      metadata: await BookService.findBook({
        book_id: req.params.book_id
      })
    }).send(res)
  }
  // END QUERY //
}

module.exports = new BookController()