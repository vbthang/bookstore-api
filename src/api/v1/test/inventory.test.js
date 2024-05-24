'use strict'

const RedisPubSubService = require('../services/redisPubsub.service')

class InventoryServiceTest {
    constructor() {
        RedisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log('Received message:', message);
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(bookId, quantity) {
        console.log(`Updated inventory ${bookId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()