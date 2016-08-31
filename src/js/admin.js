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
            }).state('admin-users', {
                url: '/admin/users',
                templateUrl: './dist/html/admin/users/index.html',
                controller: 'AdminUsersController',
                authenticate: true
            });
        }
    ]);

    angular.module('nick.blog').controller('AdminController', ['$scope',
        function($scope) {
            $("footer").hide();
        }
    ]).controller('AdminPostsController', ['$rootScope', '$scope', '$http', '$state', 'API_ROOT',
        function($rootScope, $scope, $http, $state, API_ROOT) {

            $("footer").hide();

            $scope.currentUser = $rootScope.currentUser;

            $scope.uploadFile = function() {
                var file = event.target.files[0];
                
                var fd = new FormData();
                fd.append("file", file);

                $http.post(API_ROOT + 'admin/uploadImage', fd, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
                    var url = API_ROOT.split(/\/*\//).splice(0,2).join("//") + '/' + response;
                    $("#postEditor").val($("#postEditor").val() + '<img src="' + file.name + '" width="100%">\n').trigger('change');
                }).error(function (data, header, config, status) {
                    alert("Upload image error");
                });
            };

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
                }).error(function(data, header, config, status) {
                    // error occurs
                    $state.go('login');
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
                $scope.selectedPost = {}
                $scope.selectedPost.user = $scope.currentUser;
                return $scope.selectedPost;
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

            $("footer").hide();

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
    ]).controller('AdminUsersController', ['$scope', '$http', '$state', 'API_ROOT',
        function($scope, $http, $state, API_ROOT) {

            $("footer").hide();

            $scope.uploadAvatar = function() {
                var file = event.target.files[0];
                
                var fd = new FormData();
                fd.append("file", file);

                $http.post(API_ROOT + 'admin/uploadAvatar', fd, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
                    $scope.selectedUser.avatar = response;
                }).error(function (data, header, config, status) {
                    alert("Upload avatar error");
                });
            };

            $scope.select = function(user) {
                $scope.editTitle = 'Edit user';
                return $scope.selectedUser = user;
            };

            $scope.search = true;

            $http.get(API_ROOT + 'admin/users').success(function(users) {
                return $scope.users = users;
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
                        var renderer = new marked.Renderer();

                        renderer.code = function(code, language){
                          return '<pre><code class="hljs ' + language + '">' + 
                            hljs.highlight(language, code).value +
                            '</code></pre>';
                        };

                        return marked(e.getContent(), { renderer: renderer });
                    },

                    onChange: function(e) {
                        ngModel.$setViewValue(e.getContent());
                    }
                });
            }
        }
    });

    angular.module('nick.blog').directive('customOnChange', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var onChangeFunc = scope.$eval(attrs.customOnChange);
                    element.bind('change', onChangeFunc);
                }
            };
        }
    ]);

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
    ]);

}).call(this);
