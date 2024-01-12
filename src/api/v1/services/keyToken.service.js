'use strict'

const { filter, update } = require("lodash")
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const publicKeyString = publicKey.toString()
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // })

      // return tokens ? tokens.publicKey : null

      const filter = { user: userId }, update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken
      }, options = { upsert: true, new: true}
      const token = await keytokenModel.findOneAndUpdate(filter, update, options)
      return token ? token.publicKey : null
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = KeyTokenService