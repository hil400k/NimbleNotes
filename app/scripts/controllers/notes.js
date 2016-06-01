'use strict';


angular.module('app.controllers')
  .controller('NotesCtrl', function($scope, $state, storage, notesService, notificatorService) {
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
        notificatorService.close();
        self.canChooseForRemoving = false;
    }

    self.enableChooseForRemoving = function() {
        notificatorService.open('Click "delete" button to remove choosen');
        self.canChooseForRemoving = true;
    }

    self.init = function() {
        self.canChooseForRemoving = false;
    }

    self.init();

  });
