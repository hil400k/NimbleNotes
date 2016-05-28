'use strict';

angular.module('yapp.controllers', ['ngTagsInput', 'yapp.services', 'ngSanitize', 'ngQuill'])
  .controller('DashboardCtrl', function($state, authService, storage) {
    var self = this;

    self.init = function() {
        self.$state = $state;

        self.doLogout = function() {
            authService.$unauth();
            storage.remove('settings');
            $state.go('login');
        }
    }

    self.init();
  });
