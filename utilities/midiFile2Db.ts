//Used to feed midi files into the Mongo DB
//It expects a full path to a midi file
//The path includes the information of the music style and
//the band, like /root/whatever/whateverElse/rock/beatles/Let it be
//This function will create the records for the music style and the band,
//as well as the song, if they don't exist. If there is already a
//record for the same song, band and style, it will compare the midi files
//If there is already a copy of the same midi file, it will not save anything
//If the midi file is different it will save it, but it will not create a new
//song record, it will just add the midi file to an array of midi files in the song record
import mongoose = require('mongoose');
import musicStyle = require('../models/musicStyle/musicStyle');
import band = require('../models/band/band');
import song = require('../models/song/song');
import { binaryFile } from './binaryFile';
const myBinaryFile = new binaryFile();
const crypto = require('crypto');
mongoose.Promise = global.Promise;

function SaveMusicStyle(songDetails: any): Promise<any> {
    const query = { name: songDetails.musicStyle };
    return musicStyle.findOneAndUpdate(query,
        query, { upsert: true, new: true }).exec().then(function (doc) {
            songDetails.musicStyleObjectId = doc.id;
            return songDetails;
        });
}

function SaveBand(songDetails: any): Promise<any> {
    const query = { name: songDetails.band };
    return band.findOneAndUpdate(
        query,
        { name: songDetails.band, musicStyle: songDetails.musicStyleObjectId },
        { upsert: true, new: true }).exec()
        .then(function (doc) {
            songDetails.bandObjectId = doc.id;
            return songDetails;
        });
}



function CheckSongDuplication(songDetails: any): Promise<any> {
    return song.find(
        {
            "$or": [{
                "name": songDetails.songName,
                "band": songDetails.bandObjectId
            },
            { "hash": songDetails.hash }]
        }
    ).exec()
        .then(function (songs) {
            if (songs.length === 0) {
                return songDetails;
            }
            Promise.reject("Found a duplicated song, aborting.");
        });
}


function SaveSong(songDetails: any): Promise<any> {
    let newSong = new song({
        name: songDetails.songName,
        musicStyle: songDetails.musicStyleObjectId,
        band: songDetails.bandObjectId,
        midiFile: songDetails.midiFile,
        hash: songDetails.hash
    });
    return newSong.save();
}


export class midiFile2Db {

    public async SaveSongData(filePath: string): Promise<string> {

        if (!filePath || !filePath.toLowerCase().endsWith('.mid'))
            return;

        let parts: string[] = filePath.split("/");
        let qtyParts: number = parts.length;
        //We expect a path structure of style/band/song.mid
        //If that is not the case return without doing anything
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
            songDetails = await SaveMusicStyle(songDetails);
            songDetails = await SaveBand(songDetails);
            //Read the content of the uploaded midi file and calculate hash
            songDetails.midiFile = await myBinaryFile.readFile(songDetails.filePath);
            songDetails.hash = crypto.createHash('md5').update(songDetails.midiFile).digest();
            songDetails = await CheckSongDuplication(songDetails);
            songDetails = await SaveSong(songDetails);
            return "OK";
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

}



