import mongoose = require('mongoose');

import Isong = require("./Isong");

interface IsongModel extends Isong, mongoose.Document { }

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
interface IsongModel extends Isong, mongoose.Document { }
var song = mongoose.model<IsongModel>("song", songSchema);

export = song;