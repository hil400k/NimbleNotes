'use strict';

angular.module('yapp.controllers')
  .controller('SettingsCtrl', function($scope, $state, settingsService) {
    var self = this;

    self.init = function() {
        self.settings = settingsService.get();

        self.save = function() {
            settingsService.save().then(function(data) {

            });
        }
    }

    self.init();

  });
