'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (bookId, quantity, cartId) => {
  const key = `lock_v2024_${bookId}`
  const retryTimes = 10
  const expireTime = 3000 // 3s

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, ai nam giu thi thanh toan
    const result = await setnxAsync(key, expireTime)
    console.log(`result::`, result)
    if(result === 1) {
      const isReversation = await reservationInventory({
        bookId, quantity, cartId
      })

      if(isReversation.modifiedCount) {
        await pexpire(key, expireTime)
      }
      return key
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}