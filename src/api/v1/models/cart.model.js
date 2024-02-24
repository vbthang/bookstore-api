'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
  cart_state: {
    type: String,
    required: true,
    enum: ['active', 'complete', 'false', 'pending'],
    default: 'active'
  },
  cart_books: {
    type: Array,
    required: true,
    default: []
  },
  /*
    [
      {
        bookId,
        shopId,
        quantity,
        name,
        price
      }
    ]
  */
  cart_count_book: {
    type: Number,
    default: 0
  },
  cart_customerId: {
    type: Number, 
    required: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);