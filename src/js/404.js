(function() {
    'use strict';

    angular.module('nick.blog').config(['$stateProvider',
        function($stateProvider) {
            return $stateProvider.state('404', {
                url: '/404',
                templateUrl: './404.html'
            });
        }
    ]);
}).call(this);