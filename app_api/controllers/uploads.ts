var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('extract-zip')
var randomstring = require("randomstring");
import { processUnzippedSongs } from "../../utilities/processUnzippedSongs";
let unzippedSongProcessor = new processUnzippedSongs();
import musicStyle = require('../../models/musicStyle/musicStyle');
const fs = require('fs');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.postUploadFile = async function (req, res) {
    console.log("entre a postUploadFile");
    if (req.file.mimetype !== 'application/zip') {
        sendJSONresponse(res, 400, { Result: "File is not a zip file" });
    }
    var outputFolder = 'uploads/unzipped' + randomstring.generate(7);
    extract(req.file.path, { dir: outputFolder }, function (err: any) {
        if (err) {
            console.log('The unzip of ' + req.file.originalname + 'failed');
            console.log(err);
            sendJSONresponse(res, 400, { Result: "The file could not be unzziped" });
        }
        else {
            console.log(req.file.originalname + 'unzipped OK');
            unzippedSongProcessor.Parse(outputFolder)
                .then(function (results: string) {
                    sendJSONresponse(res, 200, { Result: "File processed OK" });
                })
                .catch(function (err) {
                    console.log("Error processing unzipped file.");
                    console.log(err);
                    sendJSONresponse(res, 400, { Result: err.message  });
                });
        }
    })
}