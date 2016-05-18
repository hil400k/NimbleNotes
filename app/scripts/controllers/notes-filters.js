angular.module('yapp.controllers')

.controller('NotesFilters', function($scope, $timeout, $filter, notesService) {
    var self = this,
        timer,
        initialized = false;

    self.init = function() {
        self.applyFilters = function() {
            notesService.getNotesAPI(self.requestedListParams).then(function(response) {
                angular.forEach(response, function(note, index) {
                    note.textToDisplay = '';
                });

                if (notesService.nlistParams.priority) {
                    notesService.nlist = $filter('filter')(response, {priority: notesService.nlistParams.priority});
                    notesService.nlist = $filter('orderBy')(notesService.nlist, notesService.nlistParams.sortCriteria, true);
                } else {
                    notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
                }
                if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
            });
        }

        self.showDefault = function() {
            noteService.initListParams();
            self.requestedListParams = notesService.nlistParams;
            self.applyFilters();
        };

        self.setTag = function() {
            $timeout.cancel(timer);
            timer = $timeout(function() {
                self.applyFilters();
            }, 2000);
        };

        notesService.initListParams();
        self.requestedListParams = notesService.nlistParams;

        $scope.$watch(() => self.requestedListParams.sortCriteria, function(newVal) {
            if (initialized) {
                self.applyFilters();
            } else {
                $timeout(function() {
                    initialized = true;
                });
            }
        });

        $scope.$watch(() => self.requestedListParams.priority, function(newVal) {
            if (initialized) {
                self.applyFilters();
            } else {
                $timeout(function() {
                    initialized = true;
                });
            }
        });
    }

    self.init();
});
