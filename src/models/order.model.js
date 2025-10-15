'use strict'
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
const orderSchema = new Schema({
    orderUserId:{
        type: String,
        required: true,
    },
    orderCheckout:{
        type: Object,
        default: {}
    },
    orderShippingAddress:{
        type: Object,
        default: {}
    },
    orderPaymentMethod:{
        type: Object,
        default: {}
    },
    orderProducts:{
        type: Array,
        default: []
    },
    orderTrackingNumber:{
        type: String,
        default: "#00000001"
    },
    orderStatus:{
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);