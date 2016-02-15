(function() {
    'use strict';
    angular.module('nick.blog').config(function($stateProvider) {
        return $stateProvider.state('home', {
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
            controller: 'PostController as post'
        });
    });

    angular.module('nick.blog').controller('HomeController', ['$state', '$stateParams', '$http', '$scope',
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
                var url = 'http://localhost:8000/api/v1/posts?page=' + pageNumber;
                $scope.loading = true;
                $http.get(url).success(function(response) {
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
    ]).controller('PostController', ['$scope', '$http', '$state', '$stateParams', 
        function($scope, $http, $state, $stateParams) {
            $scope.page_title = 'Clean blog';
            if ($stateParams.slug == undefined) {
                $state.go('home');
            }

            // DATE FORMAT
            $scope.dateFormat = function(dateString) {
                if (dateString) {
                    var properlyFormattedDate = dateString.split(" ").join("T");
                    return new Date(properlyFormattedDate);
                } else {
                    return null;
                }
            };

            var post_slug = $stateParams.slug;
            $http.get('http://localhost:8000/api/v1/' + post_slug).success(function(response) {
                $scope.post_id = response.id;
                $scope.post_date = response.created_at;
                $scope.post_title = response.title;
                $scope.post_author = response.user.name;
                $scope.post_content = response.body;
            }).error(function(e) {
                $state.go('404');
            });
        }
    ]);

    // Posts Pagination
    angular.module('nick.blog').directive('postsPagination', function() {
        return {
            restrict: 'E',
            template: '<ul class="pager" ng-show="pager">' +
                '<li class="previous" ng-show="prev_page_id && !noResult">' +
                '<a ui-sref="pager({id: prev_page_id})">&larr; Newer Posts</a>' +
                '</li>' +
                '<li class="next" ng-show="next_page_id && !noResult">' +
                '<a ui-sref="pager({id: next_page_id})">Older Posts &rarr;</a>' +
                '</li>' +
                '</ul>'
        };
    });

}).call(this);