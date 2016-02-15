(function() {
    'use strict';
    angular.module('nick.blog').config(function($stateProvider) {
        return $stateProvider.state('about', {
            url: '/about',
            templateUrl: './dist/html/about.html',
            controller: 'AboutController'
        });
    });

    angular.module('nick.blog').controller('AboutController', function($scope, $http) {
        return $http.get('http://localhost:8000/api/v1/about').success(function(content) {
            return $scope.content = content;
        });
    });

}).call(this);
