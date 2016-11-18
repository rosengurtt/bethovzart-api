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
    midiFile: {
        type: Buffer,
        required: true
    },
    hash: {
        type: Buffer,
        required: true
    }
});
interface IsongModel extends Isong, mongoose.Document { }
var song = mongoose.model<IsongModel>("song", songSchema);

export = song;