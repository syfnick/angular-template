angular.module('nick.blog', ['ui.router', 'satellizer', 'ngAnimate', 'ui.router', 'ngSanitize'])
.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise(function($injector, $location) {
            var state = $injector.get('$state');
            var searchObject = $location.search();
            if (searchObject && searchObject.oauth_token) {
                state.go('login', searchObject);
            } else if (searchObject && searchObject.code) {
                state.go('login', searchObject);
            } else{
                state.go('404');
            }
            return $location.path();
        });

        $httpProvider.interceptors.push('redirectWhenLoggedOut');
    }
])
.constant('API_ROOT', 'http://localhost:8000/v1/')
.factory('redirectWhenLoggedOut', ['$q', '$injector', 
    function($q, $injector) {
        return {
            responseError: function(rejection) {
                var $state = $injector.get('$state');
                var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
                angular.forEach(rejectionReasons, function(value, key) {
                    if (rejection.data.error === value) {
                        localStorage.removeItem('user');
                        $state.go('login');
                    }
                });
                return $q.reject(rejection);
            }
        }
    }
])
.config(['$authProvider', 'API_ROOT', 
    function($authProvider, API_ROOT) {
        $authProvider.loginUrl = API_ROOT + 'auth/login';
        $authProvider.signupUrl = API_ROOT + 'auth/register';
    }
])
.run(['$rootScope', '$state', '$stateParams', 
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeError', console.log.bind(console));
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            var user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                $rootScope.authenticated = true;
                $rootScope.currentUser = user;
                if (toState.name === "login") {
                    event.preventDefault();
                    $state.go('user');
                }
            }
        });
    }
]);

// Limit the Posts content text on the Post list page/home page
angular.module('nick.blog').filter('limitHtml', 
    function() {
        return function(text, limit) {
            var changedString = String(text).replace(/<[^>]+>/gm, '');
            var length = changedString.length;
            return changedString.length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
        }
    }
);