"use strict";
const fs = require('fs');
const midiFile2Db_1 = require("./midiFile2Db");
let myMidiFile2Db = new midiFile2Db_1.midiFile2Db();
function traverseDirectory(dirname, callback) {
    let directory = [];
    fs.readdir(dirname, function (err, list) {
        dirname = fs.realpathSync(dirname);
        if (err) {
            return callback(err, null);
        }
        let listlength = list.length;
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
                }
                else {
                    if (!--listlength) {
                        callback(null, directory);
                    }
                }
            });
        });
    });
}
function sequence(array, callback) {
    function chain(array, resultSoFar, index) {
        if (index == array.length)
            return Promise.resolve();
        return Promise.resolve(callback(array[index])).then(function (thisResult) {
            return chain(array, resultSoFar + thisResult, index + 1);
        });
    }
    return chain(array, "", 0);
}
;
class processUnzippedSongs {
    Parse(path) {
        let promise = new Promise(function resolver(resolve, reject) {
            traverseDirectory(path, function (err, filePaths) {
                if (err)
                    reject(err);
                else {
                    console.log(filePaths);
                    sequence(filePaths, myMidiFile2Db.SaveSongData)
                        .then(function (results) {
                        resolve(results);
                    })
                        .catch(function (err) {
                        reject(err);
                    });
                }
            });
        });
        return promise;
    }
    ;
}
exports.processUnzippedSongs = processUnzippedSongs;
//# sourceMappingURL=processUnzippedSongs.js.map