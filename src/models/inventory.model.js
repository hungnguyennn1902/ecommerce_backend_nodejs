'use strict'
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
var inventorySchema = new mongoose.Schema({
    iven_productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    inven_location: {type: String, default: 'unknown'},
    inven_stock: {type: Number, required: true },
    inven_shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inven_reservation: {
        type: Array,
        default: []
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
}