'use strict';

var $ = require('jquery');
var angular = require('angular');
require('angular-route');

module.exports = {
  initialize: function () {
    
    var app = angular.module('ivleApp', ['ngRoute']);

    app.config(function ($interpolateProvider, $routeProvider, $locationProvider) {

      $locationProvider.html5Mode(true);

      $interpolateProvider.startSymbol('<%=');
      $interpolateProvider.endSymbol('=%>');

      $routeProvider
        .when('/ivle', {
          templateUrl: '/scripts/ivle/templates/main.html',
          controller: 'MainController'
        })
        .otherwise({
          redirectTo: '/ivle'
        });
    });

    app.controller('MainController', function ($scope) {
      $scope.items = ['Banana', 'Pineapple', 'Orange'];
    });

    angular.bootstrap($('#ivle-app'), ['ivleApp']);
  }
}
