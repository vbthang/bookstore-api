'use strict'

const { Types } = require('mongoose')
const { book, detail } = require('../../models/book.model')
const { getSelectData, unGetSelectData } = require('../../utils')

const findAllDraftForUser = async( {query, limit, skip }) => {
  return await queryBook({query, limit, skip })
}

const findAllPublishForUser = async( {query, limit, skip }) => {
  return await queryBook({query, limit, skip })
}

const searchBooksByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await book.find({
    isDraft: false,
    $text: { $search: regexSearch}
  }, {score: {$meta: 'textScore'}})
  .sort({score: {$meta: 'textScore'}})
  .lean()

  return results
}

const publishBookByUser = async({ book_shop, book_id }) => {
  const foundShop = await book.findOne({
    book_shop: new Types.ObjectId(book_shop),
    _id: new Types.ObjectId(book_id)
  })
  if(!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unPublishBookByUser = async({ book_shop, book_id }) => {
  const foundShop = await book.findOne({
    book_shop: new Types.ObjectId(book_shop),
    _id: new Types.ObjectId(book_id)
  })
  if(!foundShop) return null
  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const findAllBooks = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
  const books = await book.find( filter )
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getSelectData(select))
  .lean()

  return books
}

const findBook = async ({ book_id, unSelect }) => {
  return await book.findById(book_id).select(unGetSelectData(unSelect))
}

const findDetail = async ({ book_id, unSelect }) => {
  return await detail.findById(new Types.ObjectId(book_id)).select(unGetSelectData(unSelect))
}

const updateBookById = async({model, bookId, payload, isNew = true}) => {
  return await model.findByIdAndUpdate(bookId, payload, {
    new: isNew
  })
}


const queryBook = async ({ query, limit, skip }) => {
  return await book.find( query )
  .populate('book_shop', 'name email -_id')
  .sort({ updateAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean()
  .exec()
}

module.exports = {
  findAllDraftForUser,
  publishBookByUser,
  findAllPublishForUser,
  unPublishBookByUser,
  searchBooksByUser,
  findAllBooks,
  findBook,
  updateBookById,
  findDetail
}