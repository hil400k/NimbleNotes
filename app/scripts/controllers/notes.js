'use strict';


angular.module('yapp.controllers')
  .controller('NotesCtrl', function($scope, $state, storage, notesService) {
    var self = this;


    self.toggleChooseForRemovingAvailability = function() {
        notesService.nlistToRemoveInit();
        notesService.initNote();
        self.editingMode = false;
        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
            angular.element(item).removeClass('choosen-note');
        });
        self.canChooseForRemoving = !self.canChooseForRemoving;
    }

    self.init = function() {
        self.canChooseForRemoving = false;
        self.editingMode = false;
    }

    self.init();

  });
