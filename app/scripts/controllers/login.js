'use strict';

angular.module('yapp.controllers')
  .controller('LoginCtrl', function($location) {

    this.submit = function() {

      $location.path('/dashboard');

      return false;
    }

  });
