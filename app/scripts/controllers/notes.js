'use strict';


angular.module('yapp.controllers')
  .controller('NotesCtrl', function($scope, $state, storage, notesService) {
    var self = this;


    self.toggleChooseForRemovingAvailability = function() {
//        self.toRemoveList = [];
        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
            angular.element(item).removeClass('choosen-note');
        });
        self.canChooseForRemoving = !self.canChooseForRemoving;
    }

    self.init = function() {
        self.canChooseForRemoving = false;
    }

    self.init();

  });
