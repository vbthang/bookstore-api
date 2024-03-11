'use strict'

const { 
  BadRequestError
} = require('../core/error.response')
const {
  inventory
} = require('../models/inventory.model')
const { 
  getBookById 
} = require('../models/repositories/book.repo')

class InventoryService {
  static async addStockToInventory({
    stock, bookId, shopId, location
  }) {
    const book = await getBookById(bookId)
    if(!book) throw new BadRequestError('The book bose not exists')

    const query = {
      inven_shopId: shopId,
      inven_bookId: bookId
    }
    const updateSet = {
      $inc: {
        inven_stock: stock
      },
      $set: {
        inven_location: location
      }
    }
    const options = {
      upsert: true,
      new: true
    }

    return await inventory.findOneAndUpdate( query, updateSet, options )
  }
}

module.exports = InventoryService