'use strict';

angular.module('yapp.controllers')
  .controller('NotesCreatorCtrl', function($scope, $state, $timeout, $rootScope, $filter, storage, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.initNote();
        self.note = notesService.ncurrent;
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = true;
        }
        notesService.initNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = false;
        }
    }

    self.clearValues = function() {
        notesService.initNote();
        $scope.notesCtrl.disableChooseForRemoving();
        $rootScope.$broadcast('clear-values');
    }

    self.send = function() {
        if (!self.note.text) {
            notificatorService.open('Note should have some text!');
            return;
        }
        if (self.note.$id) {
            notesService.updateNoteAPI().then(function() {
                notificatorService.open('Note Updated');
                $timeout(function() {notificatorService.close();}, 2000);
                notesService.getNotesAPI().then(function(response) {
                    angular.forEach(response, function(note, index) {
                        note.textToDisplay = '';
                    });
                    $scope.notesCtrl.editingMode = false;
                    notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
                    if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
                });
            });
        } else {
            notesService.createNoteAPI().then(function() {
                notesService.initNote();
                notesService.getNotesAPI().then(function(response) {
                    angular.forEach(response, function(note, index) {
                        note.textToDisplay = '';
                    });
                    notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
                    if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
                });
            });
        }
    }

    self.init();

  });
