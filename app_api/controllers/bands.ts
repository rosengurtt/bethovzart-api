import mongoose = require('mongoose');
import musicStyle = require('../../models/musicStyle/musicStyle');
import band = require('../../models/band/band');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.getAllBandsForStyle = async function (req, res) {
    let styleId = req.params.styleid;
    let myBands = await band.find({ musicStyle: styleId }).select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { bands: myBands });
}

module.exports.getAllBands = async function (req, res) {
    let styleId = req.params.styleid;
    let myBands = await band.find().select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { bands: myBands });
}