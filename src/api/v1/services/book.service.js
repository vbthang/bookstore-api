'use strict'

const { book, detail } = require('../models/book.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')
const { findAllDraftForUser, publishBookByUser, findAllPublishForUser, unPublishBookByUser, searchBooksByUser, findAllBooks, findBook, updateBookById,findDetail } = require('../models/repositories/book.repo')
const { removeUnderfinedObject, updateNestedObjectParser } = require('../utils')

class Book {
  constructor({
    book_name, book_thumb, book_description, book_price, book_quantity, book_type, book_shop, book_attributes
  }) {
    this.book_name = book_name
    this.book_thumb = book_thumb
    this.book_description = book_description
    this.book_price = book_price
    this.book_quantity = book_quantity
    this.book_type = book_type
    this.book_shop = book_shop
    this.book_attributes = book_attributes
  }

  // create new book
  async createBook(book_id) {
    return await book.create({...this, _id: book_id})
  }

  // update book
  async updateBook( bookId, payload ) {
    return await updateBookById({ bookId, payload, model: book })
  }
}

// Define sub-class for different book
class Detail extends Book {
  async createBook() {
    const newDetail = await detail.create({
      ...this.book_attributes,
      book_shop: this.book_shop
    })
    if(!newDetail) throw new BadRequestError('create new Detail error')
    
    const newBook = await super.createBook(newDetail._id)
    if(!newBook) throw new BadRequestError('create new Book error')

    return newBook
  }

  async updateBook( bookId ) {
    const objectParams = removeUnderfinedObject(this)
    if(objectParams.book_attributes) {
      // update child
      await updateBookById({bookId, payload:objectParams.book_attributes, model:detail})
    }
    objectParams.book_attributes = await findDetail({book_id : bookId, unSelect : ['_id', 'book_shop', '__v', 'createdAt', 'updatedAt']})

    const updateBook = await super.updateBook(bookId, objectParams)
    return updateBook
  }
}

// Define Factory class to create book
class BookFactory {
  /**/
  static async createBook( type, payload ) {
    switch (type){
      case 'Detail':
        return new Detail(payload).createBook()
      default:
        throw new BadRequestError(`Invalid Book Types ${type}`)
    }
  }

  static async updateBook( type, bookId, payload ) {
    switch (type){
      case 'Detail':
        return new Detail(payload).updateBook(bookId)
      default:
        throw new BadRequestError(`Invalid Book Types ${type}`)
    }
  }

  // PUT //
  static async publishBookByUser({book_shop, book_id}) {
    return await publishBookByUser({book_shop, book_id})
  }

  static async unPublishBookByUser({book_shop, book_id}) {
    return await unPublishBookByUser({book_shop, book_id})
  }
  // END PUT //

  // Query
  static async findAllDraftForUser({ book_shop, limit = 50, skip = 0 }) {
    const query = { book_shop, isDraft: true }
    return await findAllDraftForUser({ query, limit, skip })
  }

  static async findAllPublishForUser({ book_shop, limit = 50, skip = 0 }) {
    const query = { book_shop, isPublished: true }
    return await findAllPublishForUser({ query, limit, skip })
  }

  static async searchBooks ({ keySearch }) {
    return await searchBooksByUser({ keySearch })
  }

  static async findAllBooks ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true} }) {
    return await findAllBooks({ limit, sort, filter, page, select: ['book_name', 'book_price', 'book_thumb'] })
  }

  static async findBook ({ book_id }) {
    return await findBook({ book_id, unSelect: ['__v'] })
  }
}

module.exports = BookFactory