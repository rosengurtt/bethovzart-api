"use strict";
const mongoose = require('mongoose');
var songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    musicStyle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    band: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    midi: {
        type: Buffer,
        required: true
    },
    midiQuality: Number
});
var song = mongoose.model("song", songSchema);
module.exports = song;
//# sourceMappingURL=song.js.map