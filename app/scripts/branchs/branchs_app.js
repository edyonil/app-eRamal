var _templateBase = './scripts';

(function () {
    'use strict';

    angular.module('ramal.app', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: "/home",
                    abstract: true,
                    templateUrl: _templateBase + '/branchs/views/template.html'
                })
                .state('home.list', {
                    url: "/list",
                    views : {
                        'form': {
                            templateUrl: _templateBase + '/branchs/views/form.html'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/home/list');

        }]);

})();