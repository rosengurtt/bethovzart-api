"use strict";
const mongoose = require('mongoose');
var bandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
var band = mongoose.model("band", bandSchema);
module.exports = band;
//# sourceMappingURL=band.js.map