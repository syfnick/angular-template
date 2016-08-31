(function() {
    'use strict';

    angular.module('nick.blog').config(['$stateProvider',
        function($stateProvider) {
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
                    url: '/post/{id}',
                    templateUrl: './dist/html/post.html',
                    controller: 'PostController as post'
                });
        }
    ]);

    angular.module('nick.blog').controller('HomeController', ['$state', '$stateParams', '$http', '$scope', 'API_ROOT',
        function($state, $stateParams, $http, $scope, API_ROOT) {
            
            $("footer").show();

            $scope.page_title = "笔记";
            $scope.page_subtitle = "";
            $scope.date = new Date();
            $scope.posts = [];
            $scope.totalPages = 0;
            $scope.currentPage = 1;
            
            $scope.page = [];
            $scope.listSizes = 5;

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
                var url = API_ROOT + 'posts?page=' + pageNumber;
                $http.get(url).success(function(response) {
                    $scope.posts = response.data;
                    $scope.itemsPerPage = response.per_page;
                    $scope.currentPage = response.current_page - 1;
                    $scope.totalPages = response.last_page;
                    $scope.totalItems = response.total;
                    $scope.prev_page_id = response.current_page == 0 ? null : response.current_page - 1;
                    $scope.next_page_id = response.current_page == response.last_page ? null : response.current_page + 1;
                    $scope.noResult = true;
                    pageNumber = parseInt(pageNumber);
                    if (typeof pageNumber === 'number') {
                        if (pageNumber % 1 === 0) {
                            if (pageNumber <= $scope.totalPages && pageNumber > 0) {
                                $scope.noResult = false;
                            }
                        }
                    }

                    $scope.offsetPage = ($scope.currentPage - 1) < 0 ? 0 : $scope.currentPage - 1;

                    var last = Math.min(Number($scope.offsetPage) + Number($scope.listSizes), $scope.totalPages);
                    for (var i = $scope.offsetPage; i < last; i ++) {
                        $scope.page.push({
                            text: i,
                            indexPage: i,
                            active: false
                        })
                    }
                    
                    if ($scope.page[$scope.currentPage - $scope.offsetPage]) {
                        $scope.page[$scope.currentPage - $scope.offsetPage].active = true;
                    }
                });
            };
            $scope.getPosts();
        }
    ]).controller('PostController', ['$scope', '$http', '$state', '$stateParams', 'API_ROOT',
        function($scope, $http, $state, $stateParams, API_ROOT) {

            if ($stateParams.id == undefined) {
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

            var post_id = $stateParams.id;
            $http.get(API_ROOT + "posts/" + post_id).success(function(response) {
                if (response == "") { 
                    $state.go('404'); 
                }
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
            restrice: 'EA',
            controller: function($scope, pagerConfig) {
                $scope.isFirst = function(){
                    return $scope.currentPage <= 0;
                };
                $scope.isLast = function(){
                    return $scope.currentPage >= $scope.totalPages - 1;
                };
                $scope.getText = function(key) {
                    return pagerConfig.text[key];
                };
            },
            templateUrl: './dist/html/modal/posts-pagination.html'
        }
    }).constant('pagerConfig', {
        text: {
            'first': '首页',
            'prev': '上一页',
            'next': '下一页',
            'last': '尾页',
        }
    });

}).call(this);
