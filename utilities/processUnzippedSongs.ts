const fs = require('fs');
import { midiFile2Db } from "./midiFile2Db";
let myMidiFile2Db = new midiFile2Db();

// Downloaded from the web. Finds all the paths of files and folders in a directory
function traverseDirectory(dirname: string, callback: (Error, string) => void) {
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
                } else {
                    if (!--listlength) {
                        callback(null, directory);
                    }
                }
            });
        });
    });
}

//Used to run the processing of files in a sequence, not in parallel
function sequence(array: string[], callback: (path: string) => Promise<string>) {
    function chain(array: string[], resultSoFar: string, index: number) {
        if (index == array.length) return Promise.resolve();
        return Promise.resolve(callback(array[index])).then(function (thisResult) {
            return chain(array, resultSoFar + thisResult, index + 1);
        });
    }
    return chain(array, "", 0);
};
export class processUnzippedSongs {

    //"path" is a folder that has music style subfolders, that have band subfolders
    // that have midi files
    //Executes myMidiFile2Db.SaveSongData sequentially for each file and folder in the path
    public Parse(path: string): Promise<string> {
        let promise = new Promise(
            function resolver(resolve, reject) {
                traverseDirectory(path, function (err: Error, filePaths: string[]) {
                    if (err)
                        reject(err);
                    else {
                        console.log(filePaths);
                        sequence(filePaths, myMidiFile2Db.SaveSongData)
                        .then(function(results:string){
                            resolve(results);
                        })
                        .catch(function (err) {
                                reject(err);
                        });
                    }
                })
            }
        );
        return promise;
    };
}

