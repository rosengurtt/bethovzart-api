"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const band = require('../../models/band/band');
const song = require('../../models/song/song');
const midi2json_1 = require("../midiUtils/midi2json");
let myMidi2json = new midi2json_1.midi2json();
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.getAllSongsForBand = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let bandId = req.params.bandid;
        let mySongs = yield song.find({ band: bandId }).select('name').sort({ name: 1 }).exec();
        sendJSONresponse(res, 200, { songs: mySongs });
    });
};
module.exports.getAllSongs = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let bandId = req.params.bandid;
        let mySongs = yield song.find().select('name').sort({ name: 1 }).exec();
        sendJSONresponse(res, 200, { songs: mySongs });
    });
};
module.exports.getAllSongsForStyle = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let styleId = req.params.styleid;
        let myBands = yield band.find({ musicStyle: styleId }).select('_id').exec();
        let mySongs = yield song.find({ band: { $in: myBands } }).select('name').sort({ name: 1 }).exec();
        sendJSONresponse(res, 200, { songs: mySongs });
    });
};
module.exports.getSongById = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let songId = req.params.songid;
        let mySong = yield song.findOne({ _id: songId }).exec();
        let myBand = yield band.findOne({ _id: mySong.band }).exec();
        sendJSONresponse(res, 200, {
            id: songId,
            name: mySong.name,
            band: { name: myBand.name, id: mySong.band }
        });
    });
};
module.exports.getSongMidiById = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let songId = req.params.songid;
        let mySong = yield song.find({ _id: songId }).exec();
        res.writeHead(200, {
            'Content-Type': 'audio/midi'
        });
        res.end(mySong[0].midiFile, 'binary');
    });
};
//# sourceMappingURL=songs.js.map