'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $rootScope, storage) {
    var self = this;

    $rootScope.$on('initNote', function(event, data) {
        $scope.$apply(function() { self.initNote(data); });
    });

    self.init = function() {
        self.initNote();
    }

    self.initNote = function(noteItem) {
        if (noteItem)
            self.note = {
                id: noteItem.id,
                text: noteItem.text,
                tags: noteItem.tags,
                name: noteItem.name,
                priority: noteItem.priority,
                dateOfCreation: noteItem.dateOfCreation,
                dateOfEditing: noteItem.dateOfEditing,
                editingsCount: noteItem.editingsCount,
                sourceUrl: noteItem.sourceUrl
            };
        else
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

//    $scope.$watch(() => this.note, function(newV, oldV) {
//
//    });

    self.send = function() {
        if (self.note.id) {
            self.updateNote();
        } else {
            self.createNote();
//            self.initNote();
        }
        $scope.notesCtrl.getNotes();
    }

    self.updateNote = function() {
        storage.update(self.note);
    }

    self.createNote = function() {
        var wordsCount = 1;

        self.note.name = self.note.text.split(/\s+/).slice(0,wordsCount).join(' ');
        self.note.id = self.note.name;
        self.note.dateOfCreation = self.note.dateOfEditing = new Date().toLocaleString();
        storage.create(self.note);
    }

    self.init();

  });
