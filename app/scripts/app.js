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
    'yapp.controllers',
    'yapp.components',
    'ui.router',
    'snap',
    'ngAnimate'
    ])
 .config(function($stateProvider, $urlRouterProvider, snapRemoteProvider) {

    snapRemoteProvider.globalOptions.touchToDrag = false;
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
          controller: 'LoginCtrl',
          controllerAs: 'login'
    })
    .state('dashboard', {
          abstract: true,
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl',
          controllerAs: 'dashboard'
    })
    .state('notes', {
        url: '/notes',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/notes.html',
        controller: 'NotesCtrl',
        controllerAs: 'notesCtrl'
    })
    .state('note', {
        url: '/notes/:id',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/note.html',
        controller: 'NoteCtrl',
        controllerAs: 'note'
    })
    .state('settings', {
        url: '/settings',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
    })
    .state('about', {
        url: '/about',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
    });

});
