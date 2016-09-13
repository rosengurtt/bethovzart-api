//Used to feed midi files into the Mongo DB
//It expects a full path to a midi files
//The path includes the information of the music style and
//the band, like /root/whatever/whateverElse/rock/beatles/Let it be
//This function will create the records for the music style and the band,
//as well as the song, if they don't exist. If there is already a
//record for the same song, band and style, it will compare the midi files
//If there is already a copy of the same midi file, it will not save anything
//If the midi file is different it will save it, but it will not create a new
//song record, it will just add the midi file to an array of midi files in the song record
var mongoose = require('mongoose');
import musicStyle = require('../models/musicStyle/musicStyle');
import band = require('../models/band/band');
import song = require('../models/song/song');

function SaveMusicStyle(songDetails: any): Promise<any> {
    var promise = new Promise(
        function resolver(resolve, reject) {
            var query = { name: songDetails.musicStyle };
            musicStyle.findOneAndUpdate(
                query,
                query,
                { upsert: true },
                function (err, doc) {
                    if (err)
                        reject(err);
                    songDetails.musicStyleObjectId = doc._id;
                    resolve(songDetails);
                });
        }
    );
    return promise;
}

function SaveBand(songDetails: any): Promise<any> {
    var promise = new Promise(
        function resolver(resolve, reject) {
            var query = { name: songDetails.band };
            band.findOneAndUpdate(
                query,
                query,
                { upsert: true },
                function (err, doc) {
                    if (err)
                        reject(err);
                    songDetails.bandObjectId = doc._id;
                    resolve(songDetails);
                });
        }
    );
    return promise;
}



function FindSong(songDetails: any): Promise<any> {
    var promise = new Promise(
        function resolver(resolve, reject) {
            song.find(
                { name: songDetails.songName, band: songDetails.bandObjectId },
                function (err, songs) {
                    if (err)
                        reject(err);
                    if (songs.length > 1)
                        reject("Found a duplicated song, aborting. Song info: " + songDetails);
                    if (songs.length === 1) {
                        songDetails.songObjectId = songs[0]._id;
                    }
                    resolve(songDetails);
                })
        }
    );
    return promise;
}


function SaveSong(songDetails:any): Promise<any>  {
    var promise = new Promise(
        function resolver(resolve, reject) {
        }
    );
    return promise;        
}

export class midiFile2Db {

    SaveSongData(filePath: String) {
        var promise = new Promise(
            function resolver(resolve, reject) {
                //If not a midi file, do nothing
                if (!filePath || !filePath.endsWith('.mid'))
                    Promise.resolve();

                var parts: string[] = filePath.split("/");
                var qtyParts: number = parts.length;
                //We expect a path structure of style/band/song.mid
                //If that is not the case return without doing anything
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
                        resolve(filePath)
                    })
                    .catch(function (e) {
                        console.log(e);
                        reject(e);
                    });
            }
        );
        return promise;
    }
}


