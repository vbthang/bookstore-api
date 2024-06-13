'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new mongoose.Schema({
  inven_bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
  inven_location: { type: String, default: 'unKnow' },
  inven_stock: { type: Number, required: true },
  inven_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
  inven_reservations: { type: Array, default: []}
  /*
    cartId
    stock
    createdOn
  */
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = {
  inventory: mongoose.model(DOCUMENT_NAME, inventorySchema)
}