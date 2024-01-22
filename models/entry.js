const mongoose = require('mongoose');
const entrySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    pos1: {
        type: String,
        required: true
    },
    pos2: {
        type: String,
        required: true
    },
    pos3: {
        type: String,
        required: true
    },
    triggers: {
        type: String,
        required: false
    },
    comments: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Entry', entrySchema);