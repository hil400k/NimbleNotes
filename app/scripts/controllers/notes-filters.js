angular.module('yapp.controllers')

.controller('NotesFilters', function($scope, $timeout, $filter, notesService) {
    var self = this,
        timer,
        filterResult = [],
        initialized = false;

    self.init = function() {
        self.applyFilters = function() {
            notesService.getNotesAPI(self.requestedListParams).then(function(response) {
                angular.forEach(response, function(note, index) {
                    note.textToDisplay = '';
                });

                filterResult = response;

                if (notesService.nlistParams.priority) {
                    filterResult = $filter('filter')(filterResult, {priority: notesService.nlistParams.priority});
                }
                if (notesService.nlistParams.tag) {
                    filterResult = $filter('tagFilter')(filterResult, notesService.nlistParams.tag);
                }
                notesService.nlist = $filter('orderBy')(filterResult, notesService.nlistParams.sortCriteria, true);

                if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
            });
        }

        self.showDefault = function() {
            notesService.initListParams();
            self.requestedListParams = notesService.nlistParams;
            self.applyFilters();
        };

        self.setTag = function() {
            $timeout.cancel(timer);
            timer = $timeout(function() {
                self.applyFilters();
            }, 1000);
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
