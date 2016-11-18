import mongoose = require('mongoose');

interface Iband{
    name:string,
    musicStyle:mongoose.Schema.Types.ObjectId, 
};

export = Iband;