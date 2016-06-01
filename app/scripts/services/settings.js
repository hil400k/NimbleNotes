angular.module('app.services')

.service('settingsService', function($firebaseObject, $q, authService, storage) {
    var ref = new Firebase('https://lazynotes.firebaseio.com/users'),
        settingsService = {},
        settings = null;

    settingsService.set = function(newSettings) {
        angular.copy(newSettings, settings);
        storage.set('settings', settings);
    }

    settingsService.get = function() {
       return settings;
    }

    settingsService.save = function() {
        var currentUser = authService.$getAuth(),
            $user = $firebaseObject(ref.child(currentUser.uid)),
            defer = $q.defer();

        $user.settings = {};
        angular.copy(settings, $user.settings);

        $user.$save().then(function() {
            defer.resolve('ok');
            storage.set('settings', settings);
        });

        return defer.promise;
    }

    settingsService.getDefault = function() {
        return {
            daysToArchive: '',
            defaultTag: ''
        };
    }

    settingsService.init = function() {
        var lsettings = storage.get('settings');

        if (!settings && lsettings) settings = lsettings;
        else if (!settings) settings = {};
    }

    settingsService.init();

    return settingsService;
});


// do login
// get settings
// save settings in settings service and in localstorage
//
// open page as logged in
// get settings (get from settings service (check service object or localstorage)) if empty load();
