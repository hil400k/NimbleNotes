'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services', 'yapp.filters', 'ngSanitize'])
  .controller('DashboardCtrl', function($state) {

    this.$state = $state;

  });
