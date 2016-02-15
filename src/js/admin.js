(function() {
    'use strict';
    var getFileUrl, uploadFile;

    angular.module('nick.blog').config(function($stateProvider) {
        return $stateProvider.state('admin-posts', {
            url: '/admin/posts',
            templateUrl: 'app/admin/posts/index.html',
            controller: 'AdminPostsCtrl',
            authenticate: true
        }).state('admin-users', {
            url: '/admin/users',
            templateUrl: 'app/admin/users/index.html',
            controller: 'AdminUsersCtrl',
            authenticate: true
        });
    });

    getFileUrl = function(file, callback) {
        var reader;
        reader = new FileReader;
        reader.onload = function(loadEvent) {
            return callback(loadEvent.target.result);
        };
        return reader.readAsDataURL(file);
    };

    uploadFile = function($scope, S3, folder, file, callback) {
        delete $scope.progress;
        if (file) {
            return S3.uploadFileToFolder(folder, 'image', file, (function(err, url) {
                if (!err) {
                    return callback(url);
                }
            }), function(progress) {
                return $scope.$apply(function() {
                    return $scope.progress = progress;
                });
            });
        } else {
            return callback('');
        }
    };

    angular.module('nick.blog').controller('AdminPostsCtrl', function($scope, $http, S3) {
        $scope.removeFromList = function(list, item) {
            return list.splice(list.indexOf(item, 1));
        };
        $scope.addToList = function(list, item) {
            return list.push(item);
        };
        $scope.toggleItemInList = function(list, item) {
            var index;
            index = list.indexOf(item);
            if (index === -1) {
                return list.push(item);
            } else {
                return list.splice(index, 1);
            }
        };
        $scope.photoFileChanged = function(input) {
            $scope.newPhotoFile = input.files[0];
            return getFileUrl($scope.newPhotoFile, function(url) {
                return $scope.$apply(function() {
                    return $scope.newPhoto = url;
                });
            });
        };
        $http.get('/api/posts').success(function(posts) {
            return $scope.posts = posts;
        });
        $http.get('/api/posts/fields/title').success(function(relevant) {
            return $scope.relevant = relevant;
        });
        $http.get('/api/users/fields/name,role').success(function(users) {
            return $scope.users = users;
        });
        $scope.select = function(post) {
            delete $scope.newPhotoFile;
            delete $scope.newPhoto;
            delete $scope.isNewPost;
            return $scope.selectedPost = post;
        };
        $scope.create = function() {
            $scope.isNewPost = true;
            return $scope.selectedPost = {
                authors: [],
                tags: [],
                gameCard: {
                    platforms: [],
                    relevantGameIds: []
                }
            };
        };
        $scope.removeImage = function(url) {
            return S3.deleteFile(url, function(err) {
                return $scope.$apply(function() {
                    if (!err) {
                        return $scope.selectedPost.cover = '';
                    }
                });
            });
        };
        $scope.publish = function(post) {
            return uploadFile($scope, S3, $scope.selectedPost.title, $scope.newPhotoFile, function(url) {
                post.cover = url;
                return $http.post('/api/posts', post).success(function(newPost) {
                    $scope.posts.push(newPost);
                    $scope.selectedPost = newPost;
                    return delete $scope.isNewPost;
                });
            });
        };
        $scope.save = function(post) {
            return uploadFile($scope, S3, $scope.selectedPost.title, $scope.newPhotoFile, function(url) {
                post.cover = url;
                return $http.put('/api/posts/' + post._id, post);
            });
        };
        return $scope["delete"] = function(post) {
            if (confirm('Delete')) {
                return $http["delete"]('/api/posts/' + post._id).success(function() {
                    $scope.posts.splice($scope.posts.indexOf(post, 1));
                    return delete $scope.selectedPost;
                });
            }
        };
    }).controller('AdminUsersCtrl', function($scope, $http, S3) {
        $scope.photoFileChanged = function(input) {
            $scope.newPhotoFile = input.files[0];
            return getFileUrl($scope.newPhotoFile, function(url) {
                return $scope.$apply(function() {
                    return $scope.newPhoto = url;
                });
            });
        };
        $http.get('/api/users').success(function(users) {
            return $scope.users = users;
        });
        $scope.select = function(user) {
            delete $scope.newPhotoFile;
            delete $scope.newPhoto;
            delete $scope.isNewUser;
            return $scope.selectedUser = user;
        };
        $scope.create = function() {
            $scope.isNewUser = true;
            return $scope.selectedUser = {};
        };
        $scope.register = function(user) {
            return uploadFile($scope, S3, user.name, $scope.newPhotoFile, function(url) {
                user.photo = url;
                return $http.post('/api/users', user).success(function(newUser) {
                    $scope.users.push(newUser);
                    $scope.selectedUser = newUser;
                    return delete $scope.isNewUser;
                });
            });
        };
        $scope.save = function(user) {
            return uploadFile($scope, S3, user.name, $scope.newPhotoFile, function(url) {
                user.photo = url;
                return $http.put('/api/users/' + user._id, user);
            });
        };
        return $scope["delete"] = function(user) {
            if (confirm('Delete')) {
                return $http["delete"]('/api/users/' + user._id).success(function() {
                    $scope.users.splice($scope.users.indexOf(user, 1));
                    return delete $scope.selectedUser;
                });
            }
        };
    });

}).call(this);