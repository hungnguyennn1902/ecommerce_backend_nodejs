'use strict'
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';
const resourceSchema = new Schema({
    src_name:{
        type: String,
        required: true
    },
    src_slug:{
        type: String,
        required: true, //000001
    },
    src_description:{
        type: String,
        default: ''
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true
});     
module.exports = model(DOCUMENT_NAME, resourceSchema);
   