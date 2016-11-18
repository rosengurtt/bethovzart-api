(function() {
    angular
        .module('bethovzartApp')
        .service('songData', songData);

    songData.$inject = ['$http'];

    function songData($http) {
        var songMidi = function(songId) {
            console.log("angular es una mierda");
            return $http.get('/api/songs/midi' + lasongIdSong, {
                responseType: 'arraybuffer'
            });
        };
        var songJson = function(songId) {
            return $http.get('/api/songs/json' + songId);
        };
        return {        
            songMidi: songMidi,
            songJson: songJson
        };

    }


})();