(function() {
    'use strict';

    angular.module('nick.blog').config(['$stateProvider',
        function($stateProvider) {
            return $stateProvider.state('admin-home', {
                url: '/admin',
                templateUrl: './dist/html/admin/home.html',
                controller: 'AdminController',
                authenticate: true
            }).state('admin-posts', {
                url: '/admin/posts',
                templateUrl: './dist/html/admin/posts/index.html',
                controller: 'AdminPostsController',
                authenticate: true
            });
        }
    ]);

    angular.module('nick.blog').controller('AdminController', ['$scope',
        function($scope) {

        }
    ]).controller('AdminPostsController', ['$scope', '$http', '$state', 'API_ROOT',
        function($scope, $http, $state, API_ROOT) {

            $scope.htmlVariable = '<h3>Try me!</h3><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';

            $scope.select = function(post) {
                $scope.edit = false;
                return $scope.selectedPost = post;
            };

            $scope.create = function() {
                $scope.isNewPost = true;
                return $scope.selectedPost = {
                    
                };
            };

            $scope.editPost = function() {
                $scope.edit = true;
            };

            $scope.publish = function() {
                $scope.edit = false;

            };

            $scope.search = true;

            $http.get(API_ROOT + 'admin/posts/all').success(function(posts) {
                return $scope.posts = posts;
            }).error(function(data, header, config, status) {
                // error occurs
                $state.go('login');
            });
        }
    ]);

}).call(this);
