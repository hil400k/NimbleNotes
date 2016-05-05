'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state, $filter) {
    var self = this;

    self.init = function() {
        $scope.notesCtrl.getNotes();
    }

    self.removeNotes = function(e) {
        var DELETE_KEY_CODE = 127;

        if (e.keyCode === DELETE_KEY_CODE) $scope.notesCtrl.removeNotesFromServer(params);
    }

    self.getListItem = function(id) {
        return $filter('getNoteById')($scope.notesCtrl.notes, id);
    }

    self.removeNotesFromServer = function(params) {

    }

    self.init();
  });
