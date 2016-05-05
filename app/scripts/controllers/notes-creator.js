'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, storage) {
    var self = this;

    self.init = function() {
        self.initNote();
    }

    self.initNote = function() {
        self.note = {
            id: null,
            text: '',
            tags: '',
            name: '',
            priority: 1,
            dateOfCreation: null,
            dateOfEditing: null,
            editingsCount: 0,
            sourceUrl: null
        };
    }

    self.clearValues = function() {
        self.initNote();
    }

//    $scope.$watch(() => this.note.text, function(newV, oldV) {
//
//    });

    self.createNote = function() {
        var wordsCount = 1;

        self.note.name = self.note.text.split(/\s+/).slice(0,wordsCount).join(' ');
        self.note.id = self.note.name;
        self.note.dateOfCreation = self.note.dateOfEditing = new Date().toLocaleString();
        storage.create(self.note);
        $scope.notesCtrl.getNotes();
        self.initNote();
    }

    self.init();

  });
