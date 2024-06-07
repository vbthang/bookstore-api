const amqp = require('amqplib')

const log = console.log

console.log = function () {
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // notificationEx direct
        const notiQueue = 'notificationQueueProcess' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notificationExDLX direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert
        // 1 create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })
        // 2 create Queue
        const queueRusult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi truy cap cung moj luc hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        // 3 bindQueue
        await channel.bindQueue(queueRusult.queue, notificationExchange)

        // 4 send msg
        const msg = 'A new product 1'
        console.log(`producer msg:`, msg)
        await channel.sendToQueue(queueRusult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer()
.then(rs => console.log(rs))
.catch(console.error)