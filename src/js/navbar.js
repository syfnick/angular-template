(function() {
    'use strict';

    angular.module('nick.blog').controller('NavController', ['$state', '$auth', '$rootScope', '$scope',
        function ($state, $auth, $rootScope, $scope) {
            $scope.logout = function() {
                $auth.logout().then(function() {
                    localStorage.removeItem('user');
                    $rootScope.authenticated = false;
                    $rootScope.currentUser = null;
                    $state.go('home');
                });
            };

            $scope.currentUser = $rootScope.currentUser;
        }
    ]);
}).call(this);