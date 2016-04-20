'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
 angular
 .module('yapp', [
    'ui.router',
    'snap',
    'ngAnimate'
    ])
 .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/overview');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html',
		controller: 'BaseCtrl'
    })
    .state('login', {
		  url: '/login',
		  parent: 'base',
		  templateUrl: 'views/login.html',
		  controller: 'LoginCtrl'
	  })
    .state('overview', {
        url: '/overview',
        parent: 'base',
		templateUrl: 'views/dashboard/overview.html'
    })
    .state('reports', {
        url: '/reports',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/reports.html'
    });

});
