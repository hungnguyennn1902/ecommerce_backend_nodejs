'use strict'
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
var discountSchema = new mongoose.Schema({
    discountName: {type: String, required: true},
    discountDescription: {type: String, required: true},
    discountType: {type: String, default: "fixed_amount"}, // percentage, fixed_amount
    discountValue: {type: Number, required: true},
    discountCode: {type: String, required: true},
    discountStartDate: {type: Date, required: true},
    discountEndDate: {type: Date, required: true},
    discountMaxUsage: {type: Number, required: true}, // maximum number of times the discount can be used
    discountUsedCount: {type: Number, default: 0}, // number of times the discount has been used
    discountUserUsed: {type: Array, default: []}, // array of userId who have used the discount
    discountMaxUsagePerUser: {type: Number, required: true}, // maximum number of times a single user can use the discount
    discountMinOrderValue: {type: Number, default: 0},
    discountShopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    discountIsActive: {type: Boolean, default: true},
    discountApplyTo: {type: String, enum: ['all', 'specific'], default: 'all'}, // all, specific
    discountProductIds: {
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