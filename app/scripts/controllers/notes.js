'use strict';


angular.module('yapp.controllers')
  .controller('NotesCtrl', function($scope, $state, storage) {
    var self = this;

    self.getNotes = function() {
        storage.getAll()
        .then(
            function(data) {
                self.notes = data;
            },
            function(error) {

            }
        )
    }

    self.init = function() {
        self.notes = [];
    }

    self.init();

  });
