'use strict'
//!dmbg
const mongoose = require('mongoose');

const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'

var keyTokenSchema = new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref: 'User'
  },
  privateKey:{
    type:String,
    required:true  
  },
  publicKey:{
    type:String,
    required:true  
  },
  refreshTokensUsed:{
    type:Array,
    default: []
  }, 
  refreshToken: {
    type:String,
    required:true
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);