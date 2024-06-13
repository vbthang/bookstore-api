'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Resource"
const COLLECTION_NAME = "Resources"

// Declare the Schema of the Mongo model
var resourceSchema = new mongoose.Schema({
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, resourceSchema);