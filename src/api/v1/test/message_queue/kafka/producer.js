const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
            { value: 'Hello KafkaJS user by thangvb.dev!' },
        ],
    })
    await producer.disconnect()
}

runProducer().catch(console.err)

