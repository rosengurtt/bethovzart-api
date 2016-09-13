"use strict";
var mongoose = require('mongoose');
const musicStyle = require('../models/musicStyle/musicStyle');
const band = require('../models/band/band');
const song = require('../models/song/song');
function SaveMusicStyle(songDetails) {
    var promise = new Promise(function resolver(resolve, reject) {
        var query = { name: songDetails.musicStyle };
        musicStyle.findOneAndUpdate(query, query, { upsert: true }, function (err, doc) {
            if (err)
                reject(err);
            songDetails.musicStyleObjectId = doc._id;
            resolve(songDetails);
        });
    });
    return promise;
}
function SaveBand(songDetails) {
    var promise = new Promise(function resolver(resolve, reject) {
        var query = { name: songDetails.band };
        band.findOneAndUpdate(query, query, { upsert: true }, function (err, doc) {
            if (err)
                reject(err);
            songDetails.bandObjectId = doc._id;
            resolve(songDetails);
        });
    });
    return promise;
}
function FindSong(songDetails) {
    var promise = new Promise(function resolver(resolve, reject) {
        song.find({ name: songDetails.songName, band: songDetails.bandObjectId }, function (err, songs) {
            if (err)
                reject(err);
            if (songs.length > 1)
                reject("Found a duplicated song, aborting. Song info: " + songDetails);
            if (songs.length === 1) {
                songDetails.songObjectId = songs[0]._id;
            }
            resolve(songDetails);
        });
    });
    return promise;
}
function SaveSong(songDetails) {
    var promise = new Promise(function resolver(resolve, reject) {
    });
    return promise;
}
class midiFile2Db {
    SaveSongData(filePath) {
        var promise = new Promise(function resolver(resolve, reject) {
            if (!filePath || !filePath.endsWith('.mid'))
                Promise.resolve();
            var parts = filePath.split("/");
            var qtyParts = parts.length;
            if (parts.length < 3)
                Promise.resolve();
            var songDetails = {
                musicStyle: parts[qtyParts - 3],
                band: parts[qtyParts - 2],
                songName: parts[qtyParts - 1],
                filePath: filePath
            };
            SaveMusicStyle(songDetails)
                .then(function (details) {
                SaveBand(details);
            })
                .then(function (det) {
                FindSong(det);
            })
                .then(function (d) {
                SaveSong(d);
            })
                .then(function () {
                resolve(filePath);
            })
                .catch(function (e) {
                console.log(e);
                reject(e);
            });
        });
        return promise;
    }
}
exports.midiFile2Db = midiFile2Db;
//# sourceMappingURL=midiFile2Db.js.map