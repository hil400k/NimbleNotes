'use strict';


angular.module('yapp.controllers')
  .controller('NotesCtrl', function($scope, $state, storage) {
    var self = this;

    self.canChooseForRemoving = false;
    self.getNotes = function() {
        storage.getAll()
        .then(
            function(data) {
                angular.forEach(data, function(note, index) {
                    data.textToDisplay = '';
                })
                self.notes = data;
            },
            function(error) {

            }
        )
    }

    self.toggleChooseForRemovingAvailability = function() {
        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
            angular.element(item).removeClass('choosen-note');
        });
        self.canChooseForRemoving = !self.canChooseForRemoving;
    }

    self.init = function() {
        self.notes = [];
    }

    self.init();

  });
