'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state) {
    var self = this;

    self.init = function() {
        $scope.notesCtrl.getNotes();
    }

    self.init();
  });
