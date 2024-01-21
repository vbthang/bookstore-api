'use strict'

const { book, detail } = require('../models/book.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

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
}



module.exports = BookFactory