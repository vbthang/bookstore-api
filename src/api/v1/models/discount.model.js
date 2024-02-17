'use strict'
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: 'fixed_amount' }, // percentage
  discount_value: { type: Number, required: true }, // 10.000 || 10%
  discount_code: { type: String, required: true },
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: Date, required: true },
  discount_max_uses: { type: Number, required: true },
  discount_uses_count: { type: Number, required: true }, // So discount da su dung
  discount_users_used: { type: Array, default: [] }, // Ai su dung
  discount_max_uses_per_user: { type: Number, required: true }, // So luong cho phep toi da duoc su dung moi user
  discount_min_order_value: { type: Number, required: true },
  discount_shopId: { type: Schema.Types.ObjectId, ref: 'User' },
  discount_is_active: { type: Boolean, default: true },
  discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
  discount_book_ids: { type: Array, default: [] },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);