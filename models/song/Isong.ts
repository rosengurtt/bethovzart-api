import mongoose = require('mongoose');

interface Isong{
    name:string,
    musicStyle:mongoose.Schema.Types.ObjectId,    
    band:  mongoose.Schema.Types.ObjectId,
    midi: Buffer,
    midiQuality:Number
};

export = Isong;