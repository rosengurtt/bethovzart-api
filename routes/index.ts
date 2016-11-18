var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('extract-zip')
var randomstring = require("randomstring");
var request = require('request');
import { processUnzippedSongs } from "../utilities/processUnzippedSongs";
let unzippedSongProcessor = new processUnzippedSongs();
import musicStyle = require('../models/musicStyle/musicStyle');
const fs = require('fs');

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Bethovzart Home', pageUrl: '/' });
});

/* GET Library page. */
router.get('/songslibrary', async function (req, res) {
    let myStyles = await getMusicItem("/api/styles/");
    let selectedStyle = req.query.styleid;
    if (!selectedStyle)
        selectedStyle = myStyles.styles[0]._id;
    console.log(selectedStyle);
    let myBands = await getMusicItem("/api/bands/style/" + selectedStyle);
    let selectedBand= req.query.bandid;
    if (!selectedBand)
        selectedBand = myBands.bands[0]._id;
    let mySongs = await getMusicItem("/api/songs/band/" + selectedBand);  
    res.render('songsLibrary',
        {
            title: 'Bethovzart Library',
            pageUrl: '/songsLibrary',
            styles: myStyles.styles,
            bands: myBands.bands,
            songs: mySongs.songs,
            selectedStyle: selectedStyle,
            selectedBand: selectedBand
        });
});


router.post('/songslibrary', upload.single('musicFile'), function (req, res) {
    if (req.file.mimetype !== 'application/zip') {
        res.render('songsLibrary', { Message: 'Please provide a zip file' });
    }
    var outputFolder = 'uploads/unzipped' + randomstring.generate(7);
    extract(req.file.path, { dir: outputFolder }, function (err: any) {
        if (err) {
            console.log('The unzip of ' + req.file.originalname + 'failed');
            console.log(err);
            res.render('songsLibrary', { Message: 'There was an error unzipping the file' })
        }
        else {
            console.log(req.file.originalname + 'unzipped OK');
            unzippedSongProcessor.Parse(outputFolder)
                .then(function (results: string) {
                    res.render('songsLibrary', { Message: results });
                })
                .catch(function (err) {
                    console.log("Error processing unzipped file.");
                    console.log(err);
                    res.render('songsLibrary', { Message: err.message });
                });
        }
    })

});
router.get('/analyze/:songid',  function (req, res) {
    res.render('analyze',
        {
            title: 'Bethovzart Library',
            pageUrl: '/analyze'
        });
});

async function getMusicItem(url:string): Promise<any> 
{
    var requestOptions, path;
    path = url;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    return new Promise(function (resolve, reject) {
        request(
            requestOptions,
            function (err, response, body) {
                var data = body;
                if (response.statusCode === 200) {
                    resolve(data);
                }
                else {
                    reject(response.statusCode);
                }
            }
        );
    });
}

module.exports = router;
