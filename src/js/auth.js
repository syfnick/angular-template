(function() {
    'use strict';
    angular.module('nick.blog').config(function($stateProvider) {
        return $stateProvider.state('login', {
            url: '/login',
            templateUrl: './dist/html/login.html',
            controller: 'LoginController as login'
        })
        .state('register', {
            url: '/register',
            templateUrl: './dist/html/register.html',
            controller: 'RegisterController as register'
        });
    });

    angular.module('nick.blog').controller('LoginController', function($state, $auth, $http, $rootScope) {
        var vm = this;

        vm.user = {};

        vm.login = function __login() {
            $auth.login({
                email: vm.user.email,
                password: vm.user.password
            }).then(function() {
                // Return an $http request for the now authenticated
                // user so that we can flatten the promise chain
                return $http.get('http://localhost:8000/api/v1/auth/user');
            }).then(function(response) {

                // Stringify the returned data to prepare it
                // to go into local storage
                var user = JSON.stringify(response.data.user);

                // Set the stringified user data into local storage
                localStorage.setItem('user', user);

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app
                $rootScope.currentUser = response.data.user;

                // Everything worked out so we can now redirect to
                // the users state to view the data
                $state.go('home');
            }).catch(function(response) {
                console.log(response);
                window.alert('Error: Login failed');
            });
        };
    });

    angular.module('nick.blog').controller('RegisterController', function($state, $auth) {
        var vm = this;

        vm.user = {};

        vm.register = function __register() {
            $auth.signup({
                name: vm.user.name,
                email: vm.user.email,
                password: vm.user.password
            }).then(function(response) {
                console.log(response);
                $state.go('dashboard');
            }).catch(function(response) {
                console.log(response);
                window.alert('Error: Register failed');
            });
        };
    });
}).call(this);