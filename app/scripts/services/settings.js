angular.module('yapp.services')

.service('settingsService', function($firebaseObject) {
    var settingsService = {},
        settings = {};

    settingsService.set = function(newSettings) {
        angular.copy(newSettings, settings);
    }

    settingsService.get = function() {
        return settings;
    }

    settingsService.getDefault = function() {
        return {
            daysToArchive: '',
            defaultTag: ''
        };
    }

    settings = settingsService.getDefault();

    return settingsService;
});
