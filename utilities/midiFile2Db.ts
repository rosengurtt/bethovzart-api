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
let mongoose = require('mongoose');
import musicStyle = require('../models/musicStyle/musicStyle');
import band = require('../models/band/band');
import song = require('../models/song/song');
import midiFile = require('../models/song/midiFile');
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
        query,
        { upsert: true, new: true }).exec()
        .then(function (doc) {
            songDetails.bandObjectId = doc.id;
            return songDetails;
        });
}



function FindSong(songDetails: any): Promise<any> {
    return song.find(
        { name: songDetails.songName, band: songDetails.bandObjectId }).exec()
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


function SaveSong(songDetails: any): Promise<any> {

    if (songDetails.songObjectId) {

        return song.findByIdAndUpdate(songDetails.songObjectId,
            {
                $push: songDetails.newMidiFile
            },
            { upsert: false }).exec();
    }
    else {
        let newArrayOfMidi = [];
        newArrayOfMidi.push(songDetails.newMidiFile);
        let newSong = new song({
            name: songDetails.songName,
            musicStyle: songDetails.musicStyleObjectId,
            band: songDetails.bandObjectId,
            midiArray: newArrayOfMidi
        })
        return newSong.save();
    }
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
            songObjectId: null,
            arrayOfMidis: null,
            newMidiFile: null
        };
        try {
            songDetails = await SaveMusicStyle(songDetails);
            songDetails = await SaveBand(songDetails);
            songDetails = await FindSong(songDetails);
            //Read the content of the uploaded midi file and calculate hash
            const midiFileContent = await myBinaryFile.readFile(songDetails.filePath);
            let hashOfMidi = crypto.createHash('md5').update(midiFileContent).digest();
            let newMidiFile = new midiFile({
                midiBytes: midiFileContent,
                hash: hashOfMidi,
                length: midiFileContent.length
            });
            //check if we have a record of this song or we have to create one
            if (songDetails.songObjectId) {
                //First check if there is already a copy of this file in the array of midi files
                for (let midi of songDetails.arrayOfMidis) {
                    if (hashOfMidi === midi.hash)
                        // This file is already in the database, skip it
                        return;
                }
            }
            songDetails.newMidiFile = newMidiFile;
            songDetails = await SaveSong(songDetails);
        }
        catch (err) {
            console.log(err);
        }
    }

}



