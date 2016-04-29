'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services', 'yapp.filters'])
  .controller('DashboardCtrl', function($state) {

    this.$state = $state;

  });
