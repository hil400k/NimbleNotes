angular.module('yapp.controllers')

.controller('NotesFilters', function($scope, $timeout, notesService) {
    var self = this,
        timer,
        initialized = false;

    self.init = function() {
        self.applyFilters = function() {
            notesService.getNotesAPI(self.requestedListParams);
        }

        self.initParams = function() {
            self.requestedListParams = {
                sortCriteria: 'creation',
                tag: '',
                priority: null
            };
        };

        self.showDefault = function() {
            self.initParams();
            self.applyFilters();
        };

        self.setTag = function() {
            $timeout.cancel(timer);
            timer = $timeout(function() {
                self.applyFilters();
            }, 2000);
        };

        self.initParams();

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
