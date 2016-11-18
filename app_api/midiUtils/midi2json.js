"use strict";
var _ = require('underscore');
var MIDIFile = require('midifile');
var fs = require('fs');
class midi2json {
    GetJson(readBuffer) {
        var anyBuffer = toArrayBuffer(readBuffer);
        var midiFile = new MIDIFile(anyBuffer);
        var format = midiFile.header.getFormat();
        var tracks = midiFile.header.getTracksCount();
        var ticksPerBeat = midiFile.header.getTicksPerBeat();
        var returnObject = {
            format: format,
            ticksPerBeat: ticksPerBeat,
            track: []
        };
        for (var i = 0; i < tracks; i++) {
            returnObject.track[i] = midiFile.getTrackEvents(i);
        }
        return returnObject;
    }
}
exports.midi2json = midi2json;
function getMidiBytes(midiObject) {
    var buffer = getMidiHeader(midiObject.track.length, midiObject.ticksPerBeat);
    for (let k = 0; k < midiObject.track.length; k++) {
        var bufferTrack = getMidiTrackBytes(midiObject.track[k]);
        buffer = concatenateUint8Array(buffer, bufferTrack);
    }
    ;
    return buffer;
}
function getMidiHeader(tracks, ticksPerBeat) {
    var buffer = new Uint8Array(14);
    buffer[0] = 0x4D;
    buffer[1] = 0x54;
    buffer[2] = 0x68;
    buffer[3] = 0x64;
    buffer[4] = 0x00;
    buffer[5] = 0x00;
    buffer[6] = 0x00;
    buffer[7] = 0x06;
    buffer[8] = 0x00;
    buffer[9] = 0x01;
    buffer[10] = tracks >> 8;
    buffer[11] = tracks & 0xFF;
    buffer[12] = ticksPerBeat >> 8;
    buffer[13] = ticksPerBeat & 0xFF;
    return buffer;
}
function getMidiTrackBytes(track) {
    var trackHeaderLength = 8;
    var maxLength = track.length * 6 + 30;
    var buffer = new Uint8Array(maxLength);
    buffer[0] = 0x4D;
    buffer[1] = 0x54;
    buffer[2] = 0x72;
    buffer[3] = 0x6B;
    var j = trackHeaderLength;
    for (let i = 0; i < track.length; i++) {
        var eventProcessed = false;
        var deltaLength;
        var delta = track[i].delta;
        var channel = track[i].channel;
        var param1 = track[i].param1;
        var param2 = track[i].param2;
        var param3 = track[i].param3;
        var param4 = track[i].param4;
        var type = track[i].type;
        var subtype = track[i].subtype;
        var indexAtBeginningOfEvent = j;
        if (delta > (0x80 * 0x80 * 0x80))
            buffer[j++] = (delta >> 21) & 0x7F | 0x80;
        if (delta > (0x80 * 0x80))
            buffer[j++] = (delta >> 14) & 0x7F | 0x80;
        if (track[i].delta > 0x80)
            buffer[j++] = (delta >> 7) & 0x7F | 0x80;
        buffer[j++] = delta & 0x7F;
        deltaLength = j - indexAtBeginningOfEvent;
        if (type == 8 && subtype == 9) {
            buffer[j++] = 0x90 | channel;
            buffer[j++] = param1;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 8 && subtype == 8) {
            buffer[j++] = 0x80 | channel;
            buffer[j++] = param1;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 255 && subtype == 81) {
            buffer[j++] = 0xFF;
            buffer[j++] = 0x51;
            buffer[j++] = 0x03;
            var tempo = track[i].tempo;
            if (tempo > (0x1000000))
                buffer[j++] = (tempo >> 24) & 0xFF;
            if (tempo > 0x10000)
                buffer[j++] = (tempo >> 16) & 0xFF;
            if (tempo > 0x100)
                buffer[j++] = (tempo >> 8) & 0xFF;
            buffer[j++] = tempo & 0xFF;
            eventProcessed = true;
        }
        if (type == 8 && subtype == 12) {
            buffer[j++] = 0xC0 | channel;
            buffer[j++] = param1;
            eventProcessed = true;
        }
        if (type == 8 && subtype === 11 && param1 == 7) {
            buffer[j++] = 0xB0 | channel;
            buffer[j++] = 0x07;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 8 && subtype === 11 && param1 == 10) {
            buffer[j++] = 0xB0 | channel;
            buffer[j++] = 0x0A;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 8 && subtype == 11 && param1 == 121) {
            buffer[j++] = 0xB0 | channel;
            buffer[j++] = 0x79;
            buffer[j++] = 0x00;
            eventProcessed = true;
        }
        if (type == 8 && subtype == 11 && param1 == 91) {
            buffer[j++] = 0xB0 | channel;
            buffer[j++] = 0x5B;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 8 && subtype == 11 && param1 == 93) {
            buffer[j++] = 0xB0 | channel;
            buffer[j++] = 0x5D;
            buffer[j++] = param2;
            eventProcessed = true;
        }
        if (type == 255 && subtype === 33) {
            buffer[j++] = 0xFF;
            buffer[j++] = 0x21;
            buffer[j++] = 0x01;
            buffer[j++] = track[i].data[0];
            eventProcessed = true;
        }
        if (type == 255 && subtype == 89) {
            buffer[j++] = 0xFF;
            buffer[j++] = 0x59;
            buffer[j++] = 0x02;
            buffer[j++] = track[i].key;
            buffer[j++] = track[i].scale;
            eventProcessed = true;
        }
        if (type == 255 && subtype == 88) {
            buffer[j++] = 0xFF;
            buffer[j++] = 0x58;
            buffer[j++] = 0x04;
            buffer[j++] = param1;
            buffer[j++] = param2;
            buffer[j++] = param3;
            buffer[j++] = param4;
            eventProcessed = true;
        }
        if (type == 255 && subtype == 47) {
            buffer[j++] = 0xFF;
            buffer[j++] = 0x2F;
            buffer[j++] = 0x00;
            eventProcessed = true;
        }
        if (!eventProcessed) {
            j -= deltaLength;
        }
    }
    ;
    var trackLength = j - trackHeaderLength;
    buffer[4] = getNthByteOfInteger(trackLength, 3);
    buffer[5] = getNthByteOfInteger(trackLength, 2);
    buffer[6] = getNthByteOfInteger(trackLength, 1);
    buffer[7] = getNthByteOfInteger(trackLength, 0);
    return buffer.slice(0, trackLength + trackHeaderLength);
}
function getNthByteOfInteger(integer, n) {
    return Math.floor(integer / (Math.pow(0x100, n))) & 0xFF;
}
function getNthByteOfTempo(tempo, n) {
    return Math.floor(tempo / (Math.pow(0x80, n))) & 0x7F;
}
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
;
function concatenateUint8Array(a, b) {
    var c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
}
module.exports.getMidiBytes = getMidiBytes;
//# sourceMappingURL=midi2json.js.map