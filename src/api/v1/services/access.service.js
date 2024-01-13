'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils") 
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./user.service")

const RoleUser = {
  USER: 'USER',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

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
    const holderUser = await userModel.findOne({ email }).lean()
    
    if(holderUser) {
      throw new BadRequestError('Error: Shop already registered!') 
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
      name, email, password:passwordHash, roles: [RoleUser.USER]
    })

    if(newUser) {
      // created privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'  
      //   }
      // })
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