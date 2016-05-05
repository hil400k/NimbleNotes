'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $rootScope, storage, notesService) {
    var self = this;

    self.init = function() {
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
        }

        notesService.initNote();
        self.note = notesService.ncurrent;

//        notesService.initNote();
//        self.note = notesService.ncurrent;
//
//        $scope.$watch(() => notesService.ncurrent, function(newV, oldV) {
//            self.note = newV;
//        });
    }


    self.clearValues = function() {
        notesService.initNote();
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
