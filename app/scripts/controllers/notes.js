'use strict';


angular.module('yapp.controllers')
  .controller('NotesCtrl', function($scope, $state, storage, notesService) {
    var self = this;


    self.toggleChooseForRemovingAvailability = function() {
        notesService.nlistToRemoveInit();
        notesService.initNote();
        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
            angular.element(item).removeClass('choosen-note');
        });
        if (self.canChooseForRemoving) self.disableChooseForRemoving();
        else self.enableChooseForRemoving();
    }

    self.disableChooseForRemoving = function() {
        self.canChooseForRemoving = false;
    }

    self.enableChooseForRemoving = function() {
        self.canChooseForRemoving = true;
    }

    self.init = function() {
        self.canChooseForRemoving = false;
    }

    self.init();

  });
