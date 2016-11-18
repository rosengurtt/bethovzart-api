import mongoose = require('mongoose');
import band = require('../../models/band/band');
import song = require('../../models/song/song');
import { midi2json } from "../midiUtils/midi2json";
import Isong = require('../../models/song/Isong');
import Iband = require('../../models/band/Iband');
let myMidi2json = new midi2json();

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.getAllSongsForBand = async function (req, res) {
    let bandId = req.params.bandid;
    let mySongs = await song.find({ band: bandId }).select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { songs: mySongs });
}

module.exports.getAllSongs = async function (req, res) {
    let bandId = req.params.bandid;
    let mySongs = await song.find().select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { songs: mySongs });
}

module.exports.getAllSongsForStyle = async function (req, res) {
    let styleId = req.params.styleid;
    let myBands = await band.find({ musicStyle: styleId }).select('_id').exec();
    let mySongs = await song.find({ band: { $in: myBands } }).select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { songs: mySongs });
}

module.exports.getSongById = async function (req, res) {
    let songId = req.params.songid;
    let mySong: Isong = await song.findOne({ _id: songId }).exec();
    let myBand: Iband = await band.findOne({ _id: mySong.band }).exec();
    sendJSONresponse(res, 200,
        {
            id: songId,
            name: mySong.name,
            band: { name: myBand.name, id: mySong.band }
        });
}

module.exports.getSongMidiById = async function (req, res) {
    let songId = req.params.songid;
    let mySong = await song.find({ _id: songId }).exec();
    res.writeHead(200, {
        'Content-Type': 'audio/midi'
    });
    res.end(mySong[0].midiFile, 'binary');
}