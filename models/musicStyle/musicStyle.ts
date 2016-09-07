import mongoose = require('mongoose');

import ImusicStyle = require("./ImusicStyle");

interface ImusicStyleModel extends ImusicStyle, mongoose.Document { }

var musicStyleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    }
});
var musicStyle = mongoose.model<ImusicStyleModel>("musicStyle", musicStyleSchema);

export = musicStyle;
