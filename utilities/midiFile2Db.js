"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
let mongoose = require('mongoose');
const musicStyle = require('../models/musicStyle/musicStyle');
const band = require('../models/band/band');
const song = require('../models/song/song');
const midiFile = require('../models/song/midiFile');
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
    return band.findOneAndUpdate(query, query, { upsert: true, new: true }).exec()
        .then(function (doc) {
        songDetails.bandObjectId = doc.id;
        return songDetails;
    });
}
function FindSong(songDetails) {
    return song.find({ name: songDetails.songName, band: songDetails.bandObjectId }).exec()
        .then(function (songs) {
        if (songs.length === 0) {
            return songDetails;
        }
        if (songs.length === 1) {
            songDetails.songObjectId = songs[0].id;
            songDetails.arrayOfMidis = songs[0].midiArray;
            return songDetails;
        }
        if (songs.length > 1)
            Promise.reject("Found a duplicated song, aborting.");
    });
}
function SaveSong(songDetails) {
    if (songDetails.songObjectId) {
        return song.findByIdAndUpdate(songDetails.songObjectId, {
            $push: songDetails.newMidiFile
        }, { upsert: false }).exec();
    }
    else {
        let newArrayOfMidi = [];
        newArrayOfMidi.push(songDetails.newMidiFile);
        let newSong = new song({
            name: songDetails.songName,
            musicStyle: songDetails.musicStyleObjectId,
            band: songDetails.bandObjectId,
            midiArray: newArrayOfMidi
        });
        return newSong.save();
    }
}
class midiFile2Db {
    SaveSongData(filePath) {
        return __awaiter(this, void 0, Promise, function* () {
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
                songObjectId: null,
                arrayOfMidis: null,
                newMidiFile: null
            };
            try {
                songDetails = yield SaveMusicStyle(songDetails);
                songDetails = yield SaveBand(songDetails);
                songDetails = yield FindSong(songDetails);
                const midiFileContent = yield myBinaryFile.readFile(songDetails.filePath);
                let hashOfMidi = crypto.createHash('md5').update(midiFileContent).digest();
                let newMidiFile = new midiFile({
                    midiBytes: midiFileContent,
                    hash: hashOfMidi,
                    length: midiFileContent.length
                });
                if (songDetails.songObjectId) {
                    for (let midi of songDetails.arrayOfMidis) {
                        if (hashOfMidi === midi.hash)
                            return;
                    }
                }
                songDetails.newMidiFile = newMidiFile;
                songDetails = yield SaveSong(songDetails);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.midiFile2Db = midiFile2Db;
//# sourceMappingURL=midiFile2Db.js.map