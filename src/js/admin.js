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
            }).state('admin-categories', {
                url: '/admin/categories',
                templateUrl: './dist/html/admin/categories/index.html',
                controller: 'AdminCategoriesController',
                authenticate: true
            });
        }
    ]);

    angular.module('nick.blog').controller('AdminController', ['$scope',
        function($scope) {

        }
    ]).controller('AdminPostsController', ['$scope', '$http', '$state', 'API_ROOT',
        function($scope, $http, $state, API_ROOT) {

            $scope.save = function() {
                $http({
                    method: 'POST',
                    url: API_ROOT + 'admin/posts',
                    data: $.param($scope.selectedPost),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $scope.posts.unshift($scope.selectedPost);
                    $scope.isNewPost = false;
                    $scope.select($scope.selectedPost);
                });
            };

            $scope.select = function(post) {
                $scope.edit = false;
                $scope.isNewPost = false;
                $scope.selectedCategory = post.category;
                return $scope.selectedPost = post;
            };

            $scope.create = function() {
                $scope.isNewPost = true;
                $scope.editTitle = 'New post';
                $scope.selectedCategory = {};
                return $scope.selectedPost = {};
            };

            $scope.editPost = function() {
                $scope.edit = true;
                $scope.editTitle = 'Edit post';
            };

            $scope.deletePost = function() {
                $http.delete(API_ROOT + 'admin/posts/' + $scope.selectedPost.id).success(function(categories) {
                    $scope.posts.splice($scope.posts.indexOf($scope.selectedPost), 1);
                    $scope.select($scope.posts[0]);
                }).error(function(data, header, config, status) {
                    // error occurs
                    $state.go('login');
                });
            }

            $scope.publish = function() {
                $scope.edit = false;
            };

            $scope.changeCategory = function(selectedCategory) {
                $scope.selectedPost.category = selectedCategory;
                $scope.selectedPost.category_id = selectedCategory.id;
            };

            $scope.search = true;

            $http.get(API_ROOT + 'admin/posts/all').success(function(posts) {
                return $scope.posts = posts;
            }).error(function(data, header, config, status) {
                // error occurs
                $state.go('login');
            });

            $http.get(API_ROOT + 'admin/categories').success(function(categories) {
                return $scope.categories = categories;
            }).error(function(data, header, config, status) {
                // error occurs
                $state.go('login');
            });
        }
    ]).controller('AdminCategoriesController', ['$scope', '$http', '$state', 'API_ROOT',
        function($scope, $http, $state, API_ROOT) {

            $scope.save = function() {
                $http({
                    method: 'POST',
                    url: API_ROOT + 'admin/categories',
                    data: $.param($scope.selectedCategory),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
                })
                .success(function(data) {
                    console.log(data);
                })
                .error(function(data, header, config, status) {
                    // error occurs
                    $state.go('login');
                });
            };

            $scope.create = function() {
                $scope.isNewCategory = true;
                $scope.editTitle = 'New category';
                return $scope.selectedCategory = {};
            };

            $scope.select = function(category) {
                $scope.editTitle = 'Edit category';
                $scope.isNewCategory = false;
                return $scope.selectedCategory = category;
            };

            $scope.search = true;

            $http.get(API_ROOT + 'admin/categories').success(function(categories) {
                return $scope.categories = categories;
            }).error(function(data, header, config, status) {
                // error occurs
                $state.go('login');
            });
        }
    ]);

    angular.module('nick.blog').directive("markdownEditor", function() {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                $(element).markdown({
                    preview: true,

                    onPreview: function(e) {
                        return marked(e.getContent());
                    },

                    onChange: function(e) {
                        ngModel.$setViewValue(e.getContent());
                    }
                });
            }
        }
    });

    angular.module('nick.blog').directive('deleteButton', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = "确认删除？";
                    var clickAction = attr.confirmedClick;
                    element.bind('click', function(event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }
    ])

}).call(this);
