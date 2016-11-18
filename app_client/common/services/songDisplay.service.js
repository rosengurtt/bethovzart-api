(function() {
    angular
        .module('bethovzartApp')
        .service('songDisplay', songDisplay);

    var noteOn = 9;
    var noteOff = 8;
    var tracks;
    var noTracks;
    var noTracksWithNotes = 0;
    var songDuration;
    var svgBox;
    var svgns = "http://www.w3.org/2000/svg";
    var svgBoxWidth;
    var svgBoxHeight;
    var separationBetweenTracks = 15;
    var trackHeight;
    var model;

    function songDisplay() {
        var LoadDisplay = function(songData, scale) {
            tracks = getNotesSequences(songData.track);
            noTracks = tracks.length;
            for (t = 0; t < noTracks; t++) {
                if (tracks[t].notes.length > 0) noTracksWithNotes++;
            }
            svgBox = document.getElementById("svgBox");
            svgBoxWidth = svgBox.clientWidth;
            svgBoxHeight = svgBox.clientHeight;
            trackHeight = (svgBoxHeight / noTracksWithNotes) - (separationBetweenTracks * (noTracksWithNotes - 1)) / 2;
            model = document.getElementById("note");

            songDuration = getSongDuration(tracks);
            Draw();

        }
        return {
            LoadDisplay: LoadDisplay
        };
    }

    function Draw(scale) {
        var i = -1; //this index corresponds to tracks shown (we show only tracks with notes)
        for (n = 0; n < tracks.length; n++) {
            if (tracks[n].notes.length === 0) continue;
            i++;
            var verticalScale = trackHeight / (tracks[n].maxPitch - tracks[n].minPitch);

            var horizontalScale = svgBoxWidth / songDuration;
            var verticalShift = ((i + 1) * (trackHeight)) + (i * separationBetweenTracks);
            var noteSeq = tracks[n].notes;
            console.log("verticalShift" + verticalShift);
            for (m = 0; m < noteSeq.length; m++) {
                var note = noteSeq[m];
                var cx = note[0] * horizontalScale;
                var cy = verticalShift - ((note[1] - tracks[n].minPitch) * verticalScale);
                var copy = model.cloneNode(true);
                copy.setAttributeNS(null, "cx", cx);
                copy.setAttributeNS(null, "cy", cy);
                svgBox.appendChild(copy);
            }
        }

    }

    //Returns the lowest and highest pitches in a track
    function getTrackRange(t) {
        var min = 500;
        var max = 0;
        for (i = 0; i < t.length; i++) {
            var pitch = t[i][1];
            if (pitch < min) min = pitch;
            if (pitch > max) {
                max = pitch;
            }
        }
        return [min, max];
    }

    //Returns the number of ticks in the whole song
    function getSongDuration(tracks) {
        var duration = 0;
        for (i = 0; i < tracks.length; i++) {
            if (tracks[i].notes.length > 0) {
                var trackLength = tracks[i].notes.length;
                var lastNote = tracks[i].notes[trackLength - 1]
                var timeStartsLastNote = lastNote[0];
                var durationLastNote = lastNote[2];
                var endTrack = timeStartsLastNote + durationLastNote;
                if (endTrack > duration) {
                    duration = endTrack;
                }
            }
        }
        return duration;
    }
    // Returns an array of objects that have: an array with the notes, and the max and min pitch
    function getNotesSequences(midiTracks) {
        var musicTracks = [];
        for (k = 0; k < midiTracks.length; k++) {
            var trackNotes = getNotes(midiTracks[k]);
            musicTracks[k] = {};
            musicTracks[k].notes = trackNotes;
            var songRange = getTrackRange(trackNotes);
            musicTracks[k].maxPitch = songRange[1];
            musicTracks[k].minPitch = songRange[0];
        }
        return musicTracks;
    }

    //returns an array of triplets [x,y,z] where
    // x = number of ticks from beginning of the songData
    // y = pitch
    // z = volume
    function getNotes(midiTrack) {
        var returnArray = [];
        var timeSinceStart = 0;
        var trackLength = midiTrack.length;
        for (i = 0; i < trackLength; i++) {
            var midiEvent = midiTrack[i];
            timeSinceStart += midiEvent.delta;
            //Loof for note one events         
            if (midiEvent.type === 8 && midiEvent.subtype === noteOn) {
                var pitch = midiEvent.param1;
                var duration = 0;
                //Find corresponding note off
                for (j = i + 1; j < trackLength; j++) {
                    var nextEvent = midiTrack[j];
                    duration += nextEvent.delta;
                    if (nextEvent.type === 8 && nextEvent.subtype === noteOff && nextEvent.param1 === pitch) {
                        //Found the note off, save the point
                        returnArray.push([timeSinceStart, pitch, duration]);
                        break;
                    }
                }
            }
        }
        return returnArray;
    }

})();