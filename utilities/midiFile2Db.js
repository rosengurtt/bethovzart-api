"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongoose = require('mongoose');
const musicStyle = require('../models/musicStyle/musicStyle');
const band = require('../models/band/band');
const song = require('../models/song/song');
const binaryFile_1 = require('./binaryFile');
const myBinaryFile = new binaryFile_1.binaryFile();
const crypto = require('crypto');
mongoose.Promise = global.Promise;
function SaveMusicStyle(songDetails) {
    const query = { name: songDetails.musicStyle };
    return musicStyle.findOneAndUpdate(query, query, { upsert: true, new: true }).exec().then(function (doc) {
        songDetails.musicStyleObjectId = doc.id;
        return songDetails;
    });
}
function SaveBand(songDetails) {
    const query = { name: songDetails.band };
    return band.findOneAndUpdate(query, { name: songDetails.band, musicStyle: songDetails.musicStyleObjectId }, { upsert: true, new: true }).exec()
        .then(function (doc) {
        songDetails.bandObjectId = doc.id;
        return songDetails;
    });
}
function CheckSongDuplication(songDetails) {
    return song.find({
        "$or": [{
                "name": songDetails.songName,
                "band": songDetails.bandObjectId
            },
            { "hash": songDetails.hash }]
    }).exec()
        .then(function (songs) {
        if (songs.length === 0) {
            return songDetails;
        }
        Promise.reject("Found a duplicated song, aborting.");
    });
}
function SaveSong(songDetails) {
    let newSong = new song({
        name: songDetails.songName,
        musicStyle: songDetails.musicStyleObjectId,
        band: songDetails.bandObjectId,
        midiFile: songDetails.midiFile,
        hash: songDetails.hash
    });
    return newSong.save();
}
class midiFile2Db {
    SaveSongData(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filePath || !filePath.toLowerCase().endsWith('.mid'))
                return;
            let parts = filePath.split("/");
            let qtyParts = parts.length;
            if (parts.length < 3)
                return;
            let songDetails = {
                musicStyle: parts[qtyParts - 3],
                band: parts[qtyParts - 2],
                songName: parts[qtyParts - 1],
                filePath: filePath,
                midiFile: null,
                hash: null
            };
            try {
                songDetails = yield SaveMusicStyle(songDetails);
                songDetails = yield SaveBand(songDetails);
                songDetails.midiFile = yield myBinaryFile.readFile(songDetails.filePath);
                console.log("aca esta la data de la muerte");
                console.log(songDetails.midiFile.length);
                console.log(songDetails.songName);
                songDetails.hash = crypto.createHash('md5').update(songDetails.midiFile).digest();
                songDetails = yield CheckSongDuplication(songDetails);
                songDetails = yield SaveSong(songDetails);
                return "OK";
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
}
exports.midiFile2Db = midiFile2Db;
//# sourceMappingURL=midiFile2Db.js.map