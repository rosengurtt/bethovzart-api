"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('extract-zip');
var randomstring = require("randomstring");
const processUnzippedSongs_1 = require("../../utilities/processUnzippedSongs");
let unzippedSongProcessor = new processUnzippedSongs_1.processUnzippedSongs();
const fs = require('fs');
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.postUploadFile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entre a postUploadFile");
        if (req.file.mimetype !== 'application/zip') {
            sendJSONresponse(res, 400, { Result: "File is not a zip file" });
        }
        var outputFolder = 'uploads/unzipped' + randomstring.generate(7);
        extract(req.file.path, { dir: outputFolder }, function (err) {
            if (err) {
                console.log('The unzip of ' + req.file.originalname + 'failed');
                console.log(err);
                sendJSONresponse(res, 400, { Result: "The file could not be unzziped" });
            }
            else {
                console.log(req.file.originalname + 'unzipped OK');
                unzippedSongProcessor.Parse(outputFolder)
                    .then(function (results) {
                    sendJSONresponse(res, 200, { Result: "File processed OK" });
                })
                    .catch(function (err) {
                    console.log("Error processing unzipped file.");
                    console.log(err);
                    sendJSONresponse(res, 400, { Result: err.message });
                });
            }
        });
    });
};
//# sourceMappingURL=uploads.js.map