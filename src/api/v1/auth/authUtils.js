'use strict'

// Setup json web token
// publicKey -> verify
const JWT = require('jsonwebtoken')

const createTokenPair = async ( payload, publicKey, privateKey ) => {
  try {
    const accessToken = await JWT.sign( payload, privateKey, {
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign( payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify( accessToken, publicKey, (err, decode) => {
      if(err) {
        console.error(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    
  }
}

module.exports = {
  createTokenPair
}