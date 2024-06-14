const redis = require('redis')
const { RedisErrorResponse } = require('../core/error.response')

let client = {}, statusConnectRedis = {
    CONENCT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 100000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Co loi xay ra voi Redis',
        en: 'Have a trouble with Redis'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectRedis.CONENCT, () => {
        console.log(`Redis connected`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`Redis end`)
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`Redis reconnecting`)
        clearTimeout(connectionTimeout)
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`Redis error:`, err)
        handleTimeoutError()
    })
}

const initRedis = () => {
    const instanceRedis = redis.createClient()
    client.instanceConnect = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getInstanceRedis = () => client 

const closeInstanceRedis = () => {
    client.instanceConnect.quit()
}

module.exports = {
    initRedis,
    getInstanceRedis,
    closeInstanceRedis,
    handleEventConnection
}