"use strict";
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('extract-zip');
var randomstring = require("randomstring");
const processUnzippedSongs_1 = require("../utilities/processUnzippedSongs");
let unzippedSongProcessor = new processUnzippedSongs_1.processUnzippedSongs();
const fs = require('fs');
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Bethovzart Home' });
});
router.get('/songslibrary', function (req, res) {
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});
router.post('/songslibrary', upload.single('musicFile'), function (req, res) {
    if (req.file.mimetype !== 'application/zip') {
        res.render('songsLibrary', { Message: 'Please provide a zip file' });
    }
    var outputFolder = 'uploads/unzipped' + randomstring.generate(7);
    extract(req.file.path, { dir: outputFolder }, function (err) {
        if (err) {
            console.log('The unzip of ' + req.file.originalname + 'failed');
            console.log(err);
            res.render('songsLibrary', { Message: 'There was an error unzipping the file' });
        }
        else {
            console.log(req.file.originalname + 'unzipped OK');
            unzippedSongProcessor.Parse(outputFolder)
                .then(function (results) {
                res.render('songsLibrary', { Message: results });
            })
                .catch(function (err) {
                console.log("Error processing unzipped file.");
                console.log(err);
                res.render('songsLibrary', { Message: err.message });
            });
        }
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map