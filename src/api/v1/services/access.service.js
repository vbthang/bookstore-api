'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils") 
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const keytokenModel = require("../models/keytoken.model")

const RoleUser = {
  USER: 'USER',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  /*
    check this token used?
  */
  static handleRefreshToken = async ( refreshToken ) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken )
    if(foundToken) {
      // decode
      const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey )
      console.log({ userId, email })
      // Del
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened !! Please relogin!')
    }

    const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
    if(!holderToken) throw new AuthFailureError('User not registered')

    const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)

    const foundUser = await findByEmail({ email })
    if(!foundUser) throw new AuthFailureError('User not registered 2')

    // create new pair
    const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: {userId, email},
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({delKey})
    return delKey
  }

  static login = async( { email, password, refreshToken = null }) => {
    // 1.Check email
    const foundUser = await findByEmail({ email })
    if(!foundUser) throw new BadRequestError('Shop not registered')

    // 2.Match password
    const match = await bcrypt.compare( password, foundUser.password )
    if(!match) throw new AuthFailureError('Authentication error')

    // 3.Create AT & RT and save
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4.Generate tokens
    const { _id: userId } = foundUser._id
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, 
      publicKey,
      userId: foundUser._id
    })
    return {
      user: getInfoData({fields:['_id', 'name', 'email'], object:foundUser}),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    const holderUser = await shopModel.findOne({ email }).lean()
    
    if(holderUser) {
      throw new BadRequestError('Error: User already registered!') 
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await shopModel.create({
      name, email, password:passwordHash, roles: [RoleUser.USER]
    })

    if(newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      console.log({privateKey, publicKey})

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey
      })

      if(!keyStore) {
        throw new BadRequestError('Error: KeyStore Error') 
      }

      const tokens = await createTokenPair({userId: newUser._id, email}, publicKey, privateKey)
      console.log(`Create Token Success::`, tokens)

      return {
        code: 201,
        metadata: {
          user: getInfoData({fields:['_id', 'name', 'email'], object:newUser}),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
  }
}

module.exports = AccessService