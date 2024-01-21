'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Book'
const COLLECTION_NAME = 'Books'

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  book_thumb: { type: String, required: true },
  book_description: String,
  book_price: { type: Number, required: true },
  book_quantity: { type: Number, required: true },
  book_type: { type: String, required: true, enum: ['Novel', 'Science Fiction', 'Adventure', 'Humor', 'Psychological', 'Biography', 'Program', 'Detail'] },
  book_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  book_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

const attrSchema = new mongoose.Schema({
  size: String,
  number_of_pages: Number,
  publishing_company: { type: String, required: true },
  book_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
  collection: 'Details',
  timestamps: true
})

//Export the model
module.exports = {
  book: mongoose.model(DOCUMENT_NAME, bookSchema),
  detail: mongoose.model('Detail', attrSchema)
}