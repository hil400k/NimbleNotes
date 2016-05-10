angular.module('yapp.services')

.service('settingsService', function() {
    var settingsService = {},
        settings = {};

    settings = {
        daysToArchive: null,
        defaultTag: null
    }

    settingsService.set = function(newSettings) {
        angular.copy(newSettings, settings);
    }

    settingsService.get = function() {
        return settings;
    }

    return settingsService;
});
