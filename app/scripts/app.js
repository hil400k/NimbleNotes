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

    $urlRouterProvider.when('/dashboard', '/dashboard/notes');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('base', {
        abstract: true,
        templateUrl: 'views/base.html'
    })
    .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
    })
    .state('dashboard', {
          abstract: true,
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
    })
    .state('notes', {
        url: '/notes',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/notes.html',
        controller: 'NotesCtrl'
    })
    .state('notes', { // if route has id should be 2 diff states or one with 2 views
        url: '/notes/:id',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/note.html',
        controller: 'NoteCtrl'
    })
    .state('settings', {
        url: '/settings',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/settings.html',
        controller: 'SettingsCtrl'
    })
    .state('about', {
        url: '/about',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/about.html',
        controller: 'AboutCtrl'
    });

});
