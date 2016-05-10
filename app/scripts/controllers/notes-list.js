'use strict';

angular.module('yapp.controllers')
  .controller('NotesListCtrl', function($scope, $state, $filter, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.getNotesAPICallback = function() {
            self.notes = notesService.nlist;
        }
        notesService.removeNotesAPICallback = function() {
            $scope.notesCtrl.canChooseForRemoving = false;
        }
        notesService.getNotesAPI();
    }


    self.removeNotes = function(e) {
        var DELETE_KEY_CODE_LINUX = 127,
            DELETE_KEY_CODE_WIN = 46;

        if (e.keyCode === DELETE_KEY_CODE_LINUX || e.keyCode === DELETE_KEY_CODE_WIN) {
            if ($scope.notesCtrl.canChooseForRemoving) {
                notesService.removeNotesAPI(notesService.nlistToRemove);
            } else {
                notesService.removeNotesAPI(notesService.ncurrent.id);
            }
            notificatorService.close();
        }
    }

    self.init();
  });
