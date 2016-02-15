angular.module('nick.blog', ['ui.router', 'satellizer', 'ngAnimate', 'ui.router', 'ngSanitize'])
.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise(function($injector, $location){
        var state = $injector.get('$state');
        var searchObject = $location.search();
        if (searchObject && searchObject.oauth_token){
            state.go('login', searchObject);
        } else if (searchObject && searchObject.code){
            state.go('login', searchObject);
        } else{
            state.go('404');
        }
        return $location.path();
    });
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('redirectWhenLoggedOut');
}])
.factory('redirectWhenLoggedOut', function($q, $injector) {
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
})
.config(['$authProvider', function($authProvider) {
    $authProvider.loginUrl = 'http://localhost:8000/api/v1/auth/login';
    $authProvider.signupUrl = 'http://localhost:8000/api/v1/auth/register';
}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
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
}]);

// Limit the Posts content text on the Post list page/home page
angular.module('nick.blog').filter('limitHtml', function() {
    return function(text, limit) {
        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;
        return changedString.length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
    }
});

/*

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.when('', '/');
    
    $urlRouterProvider.otherwise(function($injector, $location){
        var state = $injector.get('$state');
        var searchObject = $location.search();
        if (searchObject && searchObject.oauth_token){
            state.go('login', searchObject);
        } else if (searchObject && searchObject.code){
            state.go('login', searchObject);
        } else{
            state.go('404');
        }
        return $location.path();
    });

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: './dist/html/login.html',
            controller: 'LoginController as login'
        })
        .state('register', {
            url: '/register',
            templateUrl: './dist/html/register.html',
            controller: 'RegisterController as register'
        })
        // admin route
        .state('admin', {
            url: '/admin',
            templateUrl: './dist/html/admin/index.html',
            controller: 'AdminController as admin'
        })
        // home route
        .state('home', {
            url: '/',
            templateUrl: './dist/html/home.html',
            controller: 'HomeController as home'
        })
        .state('pager', {
            url: '/page/{id}',
            templateUrl: './dist/html/home.html',
            controller: 'HomeController as home'
        })
        .state('post', {
            url: '/post/{slug}',
            templateUrl: './dist/html/post.html',
            controller: 'postController'
        })
        .state('404', {
            url: '/404',
            templateUrl: './404.html'
        });

    $locationProvider.html5Mode({
        enabled: true
    });
}])

.controller('HomeController', ['$state', '$stateParams', '$http', '$scope',
    function ($state, $stateParams, $http, $scope) {
        $scope.page_title = "Clean Blog";
        $scope.page_subtitle = "A Clean Blog Theme by Start Bootstrap";
        $scope.date = new Date();
        $scope.posts = [];
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.range = [];
        $scope.loading = false;
        $scope.pager = false;

        // DATE FORMAT
        $scope.dateFormat = function(dateString) {
            if (dateString) {
                var properlyFormattedDate = dateString.split(" ").join("T");
                return new Date(properlyFormattedDate);
            } else {
                return null;
            }
        };

        // GET POSTS FUNCTION
        $scope.getPosts = function(pageNumber) {

            pageNumber = $stateParams.id;

            if (pageNumber === undefined) {
                pageNumber = 1;
            }

            $url = 'http://localhost:8000/api/v1/articles?page=' + pageNumber;

            $scope.loading = true;

            $http.get($url).success(function(response) {
                $scope.posts = response.data;
                $scope.totalPages = response.last_page;
                $scope.currentPage = response.current_page;
                $scope.prev_page_id = response.current_page == 0 ? null : response.current_page - 1;
                $scope.next_page_id = response.current_page == response.last_page ? null : response.current_page + 1;
                $scope.loading = false;
                $scope.noResult = true;
                $scope.pager = true;

                pageNumber = parseInt(pageNumber);
                if (typeof pageNumber === 'number') {
                    if (pageNumber % 1 === 0) {
                        if (pageNumber <= $scope.totalPages && pageNumber > 0) {
                            $scope.noResult = false;
                        }
                    }
                }
            });
        };

        $scope.getPosts();
    }
])

app.controller('UserController', function($state, $auth, $http, $rootScope) {
    var vm = this;

    vm.getUsers = function __getUsers() {

        // This request will hit the index method in the AuthenticateController
        // on the Laravel side and will return the list of users
        $http.get('http://localhost:8000/api/v1/getUsers').success(function(users) {
            vm.users = users;
        }).error(function(error) {
            vm.error = error;
        });
    };

    if (!$rootScope.authenticated) {
        alert("Please login");
        $state.go('login');
    }
});*/