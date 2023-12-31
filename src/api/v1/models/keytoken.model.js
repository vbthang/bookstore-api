'use strict'
//!dmbg
const mongoose = require('mongoose');

const COLLECTION_NAME = 'Key'
const DOCUMENT_NAME = 'Keys'

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
  refreshToken:{
    type:Array,
    default: []
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);