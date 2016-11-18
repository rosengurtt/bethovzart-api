import mongoose = require('mongoose');
import musicStyle = require('../../models/musicStyle/musicStyle');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.getAllStyles = async function (req, res) {
    let myStyles = await musicStyle.find().select('name').sort({ name: 1 }).exec();
    sendJSONresponse(res, 200, { styles: myStyles });
}