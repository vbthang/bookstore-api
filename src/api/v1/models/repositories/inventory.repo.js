'use strict'
const { inventory } = require("../inventory.model")
const { Types } = require('mongoose')

const insertInventory = async({
  bookId, shopId, stock, location = 'unKnow'
}) => {
  return await inventory.create({
    inven_bookId: bookId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  })
}

module.exports = {
  insertInventory
}