'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $rootScope, storage, notesService) {
    var self = this;

    self.init = function() {
        notesService.initNote();
        self.note = notesService.ncurrent;
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
        }
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
            $scope.notesCtrl.editingMode = false;
        }
        notesService.getNotesAPI();
    }

    self.init();

  });
