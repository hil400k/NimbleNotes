'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state) {
    var self = this;

    self.init = function() {
        $scope.notesCtrl.getNotes();
    }

    self.getListItem = function(id) {
        return $scope.notesCtrl.notes[id];
    }

    self.init();
  });
