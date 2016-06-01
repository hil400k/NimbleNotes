'use strict';

angular.module('app.controllers')
  .controller('NotesListCtrl', function($scope, $state, $filter, $timeout, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.getNotesAPICallback = function() {
            self.notes = notesService.nlist;
        }
        notesService.removeNotesAPICallback = function() {
            $scope.notesCtrl.canChooseForRemoving = false;
        }
        $timeout(function() {notificatorService.open(); });
        notesService.getNotesAPI().then(afterListReceived);
    }


    self.removeNotes = function(e) {
        var DELETE_KEY_CODE_LINUX = 127,
            DELETE_KEY_CODE_WIN = 46,
            toRemove = null;

        if (e.keyCode === DELETE_KEY_CODE_LINUX || e.keyCode === DELETE_KEY_CODE_WIN) {
            if ($scope.notesCtrl.canChooseForRemoving) {
                toRemove = notesService.nlistToRemove;
            } else {
                toRemove = notesService.ncurrent.$id;
            }
            $timeout(function() { notificatorService.open();});
            notesService.removeNotesAPI(toRemove).then(function() {
                notesService.nlistToRemoveInit();
                if (notesService.removeNotesAPICallback) notesService.removeNotesAPICallback();
                notesService.initNote();
                notesService.getNotesAPI().then(afterListReceived);
            });
        }
    }

    function afterListReceived(response) {
        angular.forEach(response, function(note, index) {
            note.textToDisplay = '';
        });

        notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
        if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
        $timeout(function() { notificatorService.close(); });
    }

    self.init();
  });
