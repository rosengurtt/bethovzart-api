import mongoose = require('mongoose');

import ImidiFile = require("./ImidiFile");

interface ImidiFileModel extends ImidiFile, mongoose.Document { }

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
interface IsongModel extends ImidiFile, mongoose.Document { }
var midiFile = mongoose.model<ImidiFileModel>("midiFile", midiFileSchema);

export = midiFile;