const RedisPubsubService = require('../services/redisPubsub.service')

class BookServiceTest {
    purchaseBook( bookId, quantity ) {
        const order = {
            bookId,
            quantity
        }
        
        RedisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new BookServiceTest()