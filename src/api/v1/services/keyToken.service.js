'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // const publicKeyString = publicKey.toString()
      const tokens = await keytokenModel.create({
        user: userId,
        privateKey,
        publicKey,
      })

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = KeyTokenService