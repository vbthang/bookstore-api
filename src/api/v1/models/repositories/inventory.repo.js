'use strict'
const { convertToObjectIdMongodb } = require("../../utils")
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

const reservationInventory = async ({
  bookId, quantity, cartId
}) => {
  const query = {
    inven_bookId: convertToObjectIdMongodb(bookId),
    inven_stock: {$gte: quantity}
  }
  const updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  }
  const options = {
    upsert: true,
    new: true
  }

  return await inventory.updateOne(query, updateSet)
}

module.exports = {
  insertInventory,
  reservationInventory
}