'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services', 'ngSanitize', 'ngQuill'])
  .controller('DashboardCtrl', function($state) {

    this.$state = $state;

  });
