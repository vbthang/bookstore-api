'use strict'

const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = 'Book'
const COLLECTION_NAME = 'Books'

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema({
  book_name: { type: String, required: true },
  book_thumb: { type: String, required: true },
  book_description: String,
  book_slug: String,
  book_price: { type: Number, required: true },
  book_quantity: { type: Number, required: true },
  book_type: { type: String, required: true, enum: ['Novel', 'Science Fiction', 'Adventure', 'Humor', 'Psychological', 'Biography', 'Program', 'Detail'] },
  book_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
  book_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
  // more
  book_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  book_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false }, // select: false -> when use findOne -> no display
  isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Create index for search
bookSchema.index({ book_name: 'text', book_description: 'text'})

// Doc middleware: run before save()
bookSchema.pre('save', function( next ) {
  this.book_slug = slugify(this.book_name, { lower: true })
  next()
})


const attrSchema = new mongoose.Schema({
  size: String,
  number_of_pages: Number,
  publishing_company: { type: String, required: true },
  book_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'}
}, {
  collection: 'Details',
  timestamps: true
})

//Export the model
module.exports = {
  book: mongoose.model(DOCUMENT_NAME, bookSchema),
  detail: mongoose.model('Detail', attrSchema)
}