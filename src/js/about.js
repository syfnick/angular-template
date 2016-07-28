(function() {
    'use strict';
    angular.module('nick.blog').config(['$stateProvider',
        function($stateProvider) {
            return $stateProvider.state('about', {
                url: '/about',
                templateUrl: './dist/html/about.html',
                controller: 'AboutController'
            });
        }
    ]);

    angular.module('nick.blog').controller('AboutController', ['$scope', '$http', 'API_ROOT', 
        function($scope, $http, API_ROOT) {
            return $http.get(API_ROOT + 'about').success(function(content) {
                return $scope.content = content;
            });
        }
    ]);

}).call(this);
