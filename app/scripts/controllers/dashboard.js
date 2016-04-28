'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services'])
  .controller('DashboardCtrl', function($state) {

    this.$state = $state;

  });
