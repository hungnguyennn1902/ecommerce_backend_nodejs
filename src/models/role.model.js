'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';
const roleSchema = new Schema({
    role_name: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'shop']
    },
    role_slug: {
        type: String,
        required: true, //00000777
    },
    role_status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'blocked']
    },
    role_description: {
        type: String,
        default: ''
    },
    role_grants: [{
        resource: {
            type: Schema.Types.ObjectId,
            ref: 'Resource',
            required: true
        },
        actions: [
            {
                type: String,
                required: true
            }
        ],
        attributes: {
            type: String,
            default: '*'
        }

    }]

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});
module.exports = model(DOCUMENT_NAME, roleSchema);