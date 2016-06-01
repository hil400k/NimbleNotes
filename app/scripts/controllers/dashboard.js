'use strict';

angular.module('app.controllers', ['ngTagsInput', 'app.services', 'ngSanitize', 'ngQuill'])
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
