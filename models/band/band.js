"use strict";
const mongoose = require('mongoose');
var bandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    musicStyle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
var band = mongoose.model("band", bandSchema);
module.exports = band;
//# sourceMappingURL=band.js.map