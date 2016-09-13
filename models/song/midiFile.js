"use strict";
const mongoose = require('mongoose');
var midiFileSchema = new mongoose.Schema({
    midiBytes: {
        type: Buffer,
        required: true
    },
    hash: {
        type: Buffer,
        required: true
    },
    quality: {
        type: Number,
        required: false
    },
    length: {
        type: Number,
        required: false
    }
});
var midiFile = mongoose.model("midiFile", midiFileSchema);
module.exports = midiFile;
//# sourceMappingURL=midiFile.js.map