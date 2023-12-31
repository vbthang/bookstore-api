'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils") 

const RoleUser = {
  USER: 'USER',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  static signUp = async ({ name, email, password }) => {
    try {
      const holderUser = await userModel.findOne({ email }).lean()

      if(holderUser) {
        return {
          code: 'xxx',
          message: 'User already registered!'
        }
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
          return {
            code:'xxxx',
            message: 'keyStore error'
          }
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
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService