'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
    cartState:{
        type: String,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cartProducts: {
        type: Array,
        default: []
    }, 
    cartCountProduct: {
        type: Number,
        default: 0
    },
    cartUserId: {
        type: String,
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);

       