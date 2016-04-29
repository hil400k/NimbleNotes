'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state, $filter) {
    var self = this;

    self.init = function() {
        $scope.notesCtrl.getNotes();
    }

    self.getListItem = function(id) {
        return $filter('getNoteById')($scope.notesCtrl.notes, id);
    }

    self.init();
  });
