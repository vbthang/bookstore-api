'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

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
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }, options = { upsert: true, new: true}
      const token = await keytokenModel.findOneAndUpdate(filter, update, options)
      return token ? token.publicKey : null
    } catch (error) {
      console.log(error)
      return error
    }
  }

  static findByUserId = async ( userId ) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId)})
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }
}

module.exports = KeyTokenService