'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMATION-001: new PROMOTION
// SHOP-001: new book by User following

const notificationSchema = new Schema({
    noti_type: {type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], require: true},
    noti_senderId: {type: Schema.Types.ObjectId, require: true, ref: 'User'},
    noti_receivedId: {type: String, require: true},
    noti_content: {type: String, require: true},
    noti_options: {type: Object, default: {}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model( DOCUMENT_NAME, notificationSchema )