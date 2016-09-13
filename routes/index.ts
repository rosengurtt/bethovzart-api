var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('extract-zip')
var randomstring = require("randomstring");
import { midiFile2Db } from "../utilities/midiFile2Db";

let myMidiFile2Db= new midiFile2Db();

const fs = require('fs');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Bethovzart Home' });
});

/* GET Library page. */
router.get('/songslibrary', function (req, res) {
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});


router.post('/songslibrary', upload.single('musicFile'), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    if (req.file.mimetype === 'application/zip') {
        var outputFolder = 'uploads/unzipped' + randomstring.generate(7);
        extract(req.file.path, { dir: outputFolder }, function (err: any) {
            if (err) {
                console.log('The unzip of ' + req.file.originalname + 'failed');
                console.log(err);
            }
            else {
                console.log(req.file.originalname + 'unzipped OK');
                ProcessUnzippedFiles(outputFolder);
            }
        })
    }
    res.render('songsLibrary', { title: 'Bethovzart Library' });
});

function ProcessUnzippedFiles(path: string): void {
    traverseDirectory(path, function (err: Error, filePaths: string[]) {
        if (err)
            console.log(err);
        else {
            console.log(filePaths);
            for (var i: number = 0; i < filePaths.length; i++) {
                if (filePaths[i].toLowerCase().endsWith(".mid")) {
                    var parts: string[] = filePaths[i].split("/");
                    if (parts.length > 3) {
                        myMidiFile2Db.SaveSongData(filePaths[i]);
                    }
                }
            }
        }
    })
};


function traverseDirectory(dirname: string, callback: (Error, string) => void) {
    var directory = [];
    fs.readdir(dirname, function (err, list) {
        dirname = fs.realpathSync(dirname);
        if (err) {
            return callback(err, null);
        }
        var listlength = list.length;
        list.forEach(function (file) {
            file = dirname + '/' + file;
            fs.stat(file, function (err, stat) {
                directory.push(file);
                if (stat && stat.isDirectory()) {
                    traverseDirectory(file, function (err, parsed) {
                        directory = directory.concat(parsed);
                        if (!--listlength) {
                            callback(null, directory);
                        }
                    });
                } else {
                    if (!--listlength) {
                        callback(null, directory);
                    }
                }
            });
        });
    });
}


module.exports = router;
