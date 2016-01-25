'use strict';

var app = angular.module("todo", ["ui.router"]);

app.controller("MainCtrl", function($scope) {
  $scope.foo = "bar";
})
