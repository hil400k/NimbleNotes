'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $rootScope, storage, notesService) {
    var self = this;

    self.init = function() {
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = true;
        }

        notesService.initNote();
        self.note = notesService.ncurrent;
    }


    self.clearValues = function() {
        notesService.initNote();
        $scope.notesCtrl.editingMode = false;
        $rootScope.$broadcast('clear-values');
    }

    self.send = function() {
        if (self.note.id) {
            notesService.updateNoteAPI();
        } else {
            notesService.createNoteAPI();
        }
        notesService.getNotesAPI();
    }

    self.init();

  });
