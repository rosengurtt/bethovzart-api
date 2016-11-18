import mongoose = require('mongoose');

interface Isong{
    name:string,
    musicStyle:mongoose.Schema.Types.ObjectId,    
    band:  mongoose.Schema.Types.ObjectId,
    midiFile: Buffer,
    hash: Buffer
};

export = Isong;