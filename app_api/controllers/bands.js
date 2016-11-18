"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const band = require('../../models/band/band');
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
module.exports.getAllBandsForStyle = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let styleId = req.params.styleid;
        let myBands = yield band.find({ musicStyle: styleId }).select('name').sort({ name: 1 }).exec();
        sendJSONresponse(res, 200, { bands: myBands });
    });
};
module.exports.getAllBands = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let styleId = req.params.styleid;
        let myBands = yield band.find().select('name').sort({ name: 1 }).exec();
        sendJSONresponse(res, 200, { bands: myBands });
    });
};
//# sourceMappingURL=bands.js.map