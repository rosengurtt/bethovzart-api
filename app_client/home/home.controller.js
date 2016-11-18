(function () {
        console.log("angular soret");
    angular
        .module('bethovzartApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'songData', 'songDisplay'];

    function homeCtrl($scope, songData, songDisplay) {
        console.log("voy a ejecutar al sorete");
        var vm = this;
        vm.songid = $routeParams.songid;
        vm.pageHeader = {
            title: 'Bethovzart',
            strapline: ''
        };
        vm.sidebar = {
            content: "Este sidebar va a volar"
        };
        vm.getMidi = function () {
            vm.message = "Searching la obra de Beto";
            songData.songMidi(vm.songid)
                .success(function (data) {
                    vm.message = "Llego la data";
                    vm.songMidi = data;
                })
                .error(function (e) {
                    vm.message = "Sorry, something se fue al carajo";
                });
        };
        vm.getJson = function () {
            vm.message = "Searching la obra de Beto pero en json";
            songData.songJson('beto.mid')
                .success(function (data) {
                    vm.message = "Llego la data";
                    songDisplay.LoadDisplay(data);
                    vm.songJson = data;
                })
                .error(function (e) {
                    vm.message = "Sorry, something se fue al carajo";
                });
        };
        vm.playSong = function () {
            MIDIjs.play(vm.songMidi);
        }
        vm.stopSong = function () {
            MIDIjs.stop();
        }
        vm.showError = function (error) {
            $scope.$apply(function () {
                vm.message = error.message;
            });
        };
        vm.zoomIn = function () {
            alert("In");
        }
        vm.zoomOut = function () {
            alert("Out");
        }
        vm.getMidi();
        vm.getJson();
    }
})();