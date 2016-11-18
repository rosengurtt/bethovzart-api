(function() {
    angular.module('bethovzartApp', ['ngRoute']);

    function config($routeProvider) {
        $routeProvider
            .when('/analyze/:songid', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
    angular
        .module('bethovzartApp')
        .config(['$routeProvider', config]);
})();