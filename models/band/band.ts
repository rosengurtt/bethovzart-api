import mongoose = require('mongoose');

import Iband = require("./Iband");

interface IbandModel extends Iband, mongoose.Document { }

var bandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    }
});
var band = mongoose.model<IbandModel>("band", bandSchema);

export = band;