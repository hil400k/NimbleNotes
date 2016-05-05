'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services', 'ngSanitize'])
  .controller('DashboardCtrl', function($state) {

    this.$state = $state;

  });
