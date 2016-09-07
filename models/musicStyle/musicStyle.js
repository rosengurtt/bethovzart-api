"use strict";
const mongoose = require('mongoose');
var musicStyleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
var musicStyle = mongoose.model("musicStyle", musicStyleSchema);
module.exports = musicStyle;
//# sourceMappingURL=musicStyle.js.map