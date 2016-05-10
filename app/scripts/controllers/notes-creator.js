'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $rootScope, storage, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.initNote();
        self.note = notesService.ncurrent;
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = true;
        }
        notesService.initNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = false;
        }
    }

    self.clearValues = function() {
        notesService.initNote();
        $scope.notesCtrl.disableChooseForRemoving();
        $rootScope.$broadcast('clear-values');
    }

    self.send = function() {
        if (!self.note.text) {
            notificatorService.open('Note should have some text!');
            return;
        }
        if (self.note.id) {
            notesService.updateNoteAPI();
        } else {
            notesService.createNoteAPI();
            $scope.notesCtrl.editingMode = false;
        }
        notificatorService.close();
        notesService.getNotesAPI();
    }


    self.init();

  });
