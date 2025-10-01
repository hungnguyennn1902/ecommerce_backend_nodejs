'use strict'
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
var discountSchema = new mongoose.Schema({
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {type: String, default: "fixed_amount"}, // percentage, fixed_amount
    discount_value: {type: Number, required: true},
    discount_code: {type: String, required: true},
    discount_startDate: {type: Date, required: true},
    discount_endDate: {type: Date, required: true},
    discount_max_usage: {type: Number, required: true}, // maximum number of times the discount can be used
    discount_used_count: {type: Number, required: true}, // number of times the discount has been used
    discount_user_used: {type: Array, default: []}, // array of userId who have used the discount
    discount_max_used_per_user: {type: Number, required: true}, // maximum number of times a single user can use the discount
    discount_min_order_value: {type: Number, default: 0},
    discount_shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    discount_isActive: {type: Boolean, default: true},
    discount_applies_to: {type: String, enum: ['all', 'specific'], default: 'all'}, // all, specific
    discount_productIds: {
        type: Array,
        default: []
    }// array of productId the discount applies to

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount: mongoose.model(DOCUMENT_NAME, discountSchema),
}