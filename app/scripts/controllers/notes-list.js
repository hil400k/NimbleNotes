'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state, $filter, notesService) {
    var self = this;

    self.init = function() {
        notesService.getNotesAPICallback = function() {
            self.notes = notesService.nlist;
        }
        notesService.getNotesAPI();
    }

    self.removeNotes = function(e) {
        var DELETE_KEY_CODE = 127;

        if (e.keyCode === DELETE_KEY_CODE) notesService.removeNotesAPI(notesService.ncurrent.id);
    }

    self.init();
  });
